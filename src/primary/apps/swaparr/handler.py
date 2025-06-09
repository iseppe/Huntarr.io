"""
Enhanced implementation of the swaparr functionality to detect and remove stalled downloads in Starr apps.
Based on the functionality provided by https://github.com/ThijmenGThN/swaparr/releases/tag/0.10.0

Improvements in this version:
- Better statistics tracking and reporting
- Enhanced error handling and logging
- Improved state management
- More granular status tracking
- Better API timeout handling
"""

import os
import json
import time
import hashlib
from datetime import datetime, timedelta
import requests
from typing import Dict, List, Any, Optional

from src.primary.utils.logger import get_logger
from src.primary.settings_manager import load_settings
from src.primary.utils.config_paths import SWAPARR_DIR

# Create logger
swaparr_logger = get_logger("swaparr")

# Use the centralized path configuration
SWAPARR_STATE_DIR = str(SWAPARR_DIR)  # Convert to string for compatibility with os.path

# Enhanced statistics tracking
SWAPARR_STATS = {
    'total_processed': 0,
    'strikes_added': 0,
    'downloads_removed': 0,
    'items_ignored': 0,
    'api_calls_made': 0,
    'errors_encountered': 0,
    'last_run_time': None,
    'apps_processed': set(),
    'session_start_time': datetime.utcnow().isoformat()
}

def reset_session_stats():
    """Reset session statistics"""
    global SWAPARR_STATS
    SWAPARR_STATS.update({
        'total_processed': 0,
        'strikes_added': 0,
        'downloads_removed': 0,
        'items_ignored': 0,
        'api_calls_made': 0,
        'errors_encountered': 0,
        'apps_processed': set(),
        'session_start_time': datetime.utcnow().isoformat()
    })
    swaparr_logger.info("Reset Swaparr session statistics")

def get_session_stats():
    """Get current session statistics"""
    stats_copy = SWAPARR_STATS.copy()
    stats_copy['apps_processed'] = list(stats_copy['apps_processed'])  # Convert set to list for JSON
    return stats_copy

def ensure_state_directory(app_name):
    """Ensure the state directory exists for tracking strikes for a specific app"""
    app_state_dir = os.path.join(SWAPARR_STATE_DIR, app_name)
    if not os.path.exists(app_state_dir):
        os.makedirs(app_state_dir, exist_ok=True)
        swaparr_logger.info(f"Created swaparr state directory for {app_name}: {app_state_dir}")
    return app_state_dir

def load_strike_data(app_name):
    """Load strike data for a specific app"""
    app_state_dir = ensure_state_directory(app_name)
    strike_file = os.path.join(app_state_dir, "strikes.json")
    
    if not os.path.exists(strike_file):
        return {}
    
    try:
        with open(strike_file, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        swaparr_logger.error(f"Error loading strike data for {app_name}: {str(e)}")
        SWAPARR_STATS['errors_encountered'] += 1
        return {}

def save_strike_data(app_name, strike_data):
    """Save strike data for a specific app"""
    app_state_dir = ensure_state_directory(app_name)
    strike_file = os.path.join(app_state_dir, "strikes.json")
    
    try:
        with open(strike_file, 'w') as f:
            json.dump(strike_data, f, indent=2)
    except IOError as e:
        swaparr_logger.error(f"Error saving strike data for {app_name}: {str(e)}")
        SWAPARR_STATS['errors_encountered'] += 1

def load_removed_items(app_name):
    """Load list of permanently removed items"""
    app_state_dir = ensure_state_directory(app_name)
    removed_file = os.path.join(app_state_dir, "removed_items.json")
    
    if not os.path.exists(removed_file):
        return {}
    
    try:
        with open(removed_file, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        swaparr_logger.error(f"Error loading removed items for {app_name}: {str(e)}")
        SWAPARR_STATS['errors_encountered'] += 1
        return {}

def save_removed_items(app_name, removed_items):
    """Save list of permanently removed items"""
    app_state_dir = ensure_state_directory(app_name)
    removed_file = os.path.join(app_state_dir, "removed_items.json")
    
    try:
        with open(removed_file, 'w') as f:
            json.dump(removed_items, f, indent=2)
    except IOError as e:
        swaparr_logger.error(f"Error saving removed items for {app_name}: {str(e)}")
        SWAPARR_STATS['errors_encountered'] += 1

def generate_item_hash(item):
    """Generate a unique hash for an item based on its name and size.
    This helps track items across restarts even if their queue ID changes."""
    hash_input = f"{item['name']}_{item['size']}"
    return hashlib.md5(hash_input.encode('utf-8')).hexdigest()

def parse_time_string_to_seconds(time_string):
    """Parse a time string like '2h', '30m', '1d' to seconds"""
    if not time_string:
        return 7200  # Default 2 hours
    
    unit = time_string[-1].lower()
    try:
        value = int(time_string[:-1])
    except ValueError:
        swaparr_logger.error(f"Invalid time string: {time_string}, using default 2 hours")
        return 7200
    
    if unit == 'd':
        return value * 86400  # Days to seconds
    elif unit == 'h':
        return value * 3600   # Hours to seconds
    elif unit == 'm':
        return value * 60     # Minutes to seconds
    else:
        swaparr_logger.error(f"Unknown time unit in: {time_string}, using default 2 hours")
        return 7200

def parse_size_string_to_bytes(size_string):
    """Parse a size string like '25GB', '1TB' to bytes"""
    if not size_string:
        return 25 * 1024 * 1024 * 1024  # Default 25GB
    
    # Extract the numeric part and unit
    unit = ""
    for i in range(len(size_string) - 1, -1, -1):
        if not size_string[i].isalpha():
            value = float(size_string[:i+1])
            unit = size_string[i+1:].upper()
            break
    else:
        swaparr_logger.error(f"Invalid size string: {size_string}, using default 25GB")
        return 25 * 1024 * 1024 * 1024
    
    # Convert to bytes based on unit
    if unit == 'B':
        return int(value)
    elif unit == 'KB':
        return int(value * 1024)
    elif unit == 'MB':
        return int(value * 1024 * 1024)
    elif unit == 'GB':
        return int(value * 1024 * 1024 * 1024)
    elif unit == 'TB':
        return int(value * 1024 * 1024 * 1024 * 1024)
    else:
        swaparr_logger.error(f"Unknown size unit in: {size_string}, using default 25GB")
        return 25 * 1024 * 1024 * 1024

def get_queue_items(app_name, api_url, api_key, api_timeout=120):
    """Get download queue items from a Starr app API with pagination support"""
    api_version_map = {
        "radarr": "v3",
        "sonarr": "v3",
        "lidarr": "v1",
        "readarr": "v1",
        "whisparr": "v3",
        "eros": "v3"  # Eros is Whisparr V3
    }
    
    api_version = api_version_map.get(app_name, "v3")
    all_records = []
    page = 1
    page_size = 100  # Request a large page size to reduce API calls
    
    while True:
        # Add pagination parameters
        queue_url = f"{api_url.rstrip('/')}/api/{api_version}/queue?page={page}&pageSize={page_size}"
        headers = {'X-Api-Key': api_key}
        
        try:
            SWAPARR_STATS['api_calls_made'] += 1
            response = requests.get(queue_url, headers=headers, timeout=api_timeout)
            response.raise_for_status()
            queue_data = response.json()
            
            if api_version in ["v3"]:  # Radarr, Sonarr, Whisparr, Eros use v3
                records = queue_data.get("records", [])
                total_records = queue_data.get("totalRecords", 0)
            else:  # Lidarr, Readarr use v1
                records = queue_data
                total_records = len(records)
            
            # Add this page's records to our collection
            all_records.extend(records)
            
            # If we've fetched all records or there are no more, break the loop
            if len(all_records) >= total_records or len(records) == 0:
                break
            
            # Otherwise, move to the next page
            page += 1
            
        except requests.exceptions.RequestException as e:
            swaparr_logger.error(f"Error fetching queue for {app_name} (page {page}): {str(e)}")
            SWAPARR_STATS['errors_encountered'] += 1
            break
    
    swaparr_logger.info(f"Fetched {len(all_records)} queue items for {app_name} using {page} API calls")
    
    # Normalize the response based on app type
    if app_name in ["radarr", "whisparr", "eros"]:
        return parse_queue_items(all_records, "movie", app_name)
    elif app_name == "sonarr":
        return parse_queue_items(all_records, "series", app_name)
    elif app_name == "lidarr":
        return parse_queue_items(all_records, "album", app_name)
    elif app_name == "readarr":
        return parse_queue_items(all_records, "book", app_name)
    else:
        swaparr_logger.error(f"Unknown app type: {app_name}")
        return []

def parse_queue_items(records, item_type, app_name):
    """Parse queue items from API response into a standardized format"""
    queue_items = []
    
    for record in records:
        # Skip non-dictionary records
        if not isinstance(record, dict):
            swaparr_logger.warning(f"Skipping non-dictionary record in {app_name} queue: {record}")
            continue
            
        # Extract the name based on the item type
        name = None
        if item_type == "movie" and record.get("movie"):
            name = record["movie"].get("title", "Unknown Movie")
        elif item_type == "series" and record.get("series"):
            name = record["series"].get("title", "Unknown Series")
        elif item_type == "album" and record.get("album"):
            name = record["album"].get("title", "Unknown Album")
        elif item_type == "book" and record.get("book"):
            name = record["book"].get("title", "Unknown Book")
        
        # If no name was found, try to use the download title
        if not name and record.get("title"):
            name = record.get("title", "Unknown Download")
        
        # Parse ETA if available
        eta_seconds = 0
        if record.get("timeleft"):
            eta = record.get("timeleft", "")
            # Basic parsing of timeleft format like "00:30:00" (30 minutes)
            try:
                eta_parts = eta.split(':')
                if len(eta_parts) == 3:
                    eta_seconds = int(eta_parts[0]) * 3600 + int(eta_parts[1]) * 60 + int(eta_parts[2])
            except (ValueError, IndexError):
                eta_seconds = 0
        
        queue_items.append({
            "id": record.get("id"),
            "name": name,
            "size": record.get("size", 0),
            "status": record.get("status", "unknown").lower(),
            "eta": eta_seconds,
            "error_message": record.get("errorMessage", "")
        })
    
    return queue_items

def delete_download(app_name, api_url, api_key, download_id, remove_from_client=True, api_timeout=120):
    """Delete a download from a Starr app"""
    api_version_map = {
        "radarr": "v3",
        "sonarr": "v3",
        "lidarr": "v1",
        "readarr": "v1",
        "whisparr": "v3",
        "eros": "v3"
    }
    
    api_version = api_version_map.get(app_name, "v3")
    delete_url = f"{api_url.rstrip('/')}/api/{api_version}/queue/{download_id}?removeFromClient={str(remove_from_client).lower()}&blocklist=true"
    headers = {'X-Api-Key': api_key}
    
    try:
        SWAPARR_STATS['api_calls_made'] += 1
        response = requests.delete(delete_url, headers=headers, timeout=api_timeout)
        response.raise_for_status()
        swaparr_logger.info(f"Successfully removed download {download_id} from {app_name}")
        SWAPARR_STATS['downloads_removed'] += 1
        return True
    except requests.exceptions.RequestException as e:
        swaparr_logger.error(f"Error removing download {download_id} from {app_name}: {str(e)}")
        SWAPARR_STATS['errors_encountered'] += 1
        return False

def process_stalled_downloads(app_name, instance_name, instance_data, settings):
    """Process stalled downloads for a specific app instance."""
    swaparr_logger.info(f"Checking download queue for {app_name} instance: {instance_name}")
    
    try:
        # Check if instance has Swaparr enabled
        if not instance_data.get("swaparr_enabled", False):
            swaparr_logger.info(f"Swaparr not enabled for {app_name} instance: {instance_name}, skipping")
            return 0  # Return 0 processed
        
        # Check for disabled setting during processing (every 10 items to avoid excessive I/O)
        current_swaparr_settings = load_settings("swaparr")
        if not current_swaparr_settings or not current_swaparr_settings.get("enabled", False):
            swaparr_logger.warning(f"Swaparr was disabled during download processing for {app_name} instance: {instance_name}. Stopping processing.")
            return 0
        
        # Get the download queue
        queue_response = get_queue_items(app_name, instance_data["api_url"], instance_data["api_key"])
        queue_items = queue_response
        
        swaparr_logger.info(f"Found {len(queue_items)} downloads in queue for {app_name} instance: {instance_name}")
        
        if len(queue_items) == 0:
            swaparr_logger.info(f"No downloads to process for {app_name} instance: {instance_name}")
            return 0
        
        # Process each queue item
        items_processed_this_run = 0
        for item in queue_items:
            # Check if Swaparr has been disabled during processing (every 10 items to avoid excessive I/O)
            if items_processed_this_run % 10 == 0:
                current_swaparr_settings = load_settings("swaparr")
                if not current_swaparr_settings or not current_swaparr_settings.get("enabled", False):
                    swaparr_logger.warning(f"Swaparr was disabled during download processing for {app_name} instance: {instance_name}. Stopping after processing {items_processed_this_run} items.")
                    break
            
            item_id = str(item["id"])
            item_state = "Normal"
            item_hash = generate_item_hash(item)
            
            SWAPARR_STATS['total_processed'] += 1
            items_processed_this_run += 1
            
            # Check if this item has been previously removed
            removed_items = load_removed_items(app_name)
            if item_hash in removed_items:
                last_removed_date = datetime.fromisoformat(removed_items[item_hash]["removed_time"].replace('Z', '+00:00'))
                days_since_removal = (datetime.utcnow() - last_removed_date).days
                
                # Re-remove it automatically if it's been less than 7 days since last removal
                if days_since_removal < 7:
                    swaparr_logger.warning(f"Found previously removed download that reappeared: {item['name']} (removed {days_since_removal} days ago)")
                    
                    if not settings.get("dry_run", False):
                        if delete_download(app_name, instance_data["api_url"], instance_data["api_key"], item["id"], True):
                            swaparr_logger.info(f"Re-removed previously removed download: {item['name']}")
                            # Update the removal time
                            removed_items[item_hash]["removed_time"] = datetime.utcnow().isoformat()
                            # Note: Swaparr uses its own statistics system (SWAPARR_STATS), not the hunting stats manager
                    else:
                        swaparr_logger.info(f"DRY RUN: Would have re-removed previously removed download: {item['name']}")
                    
                    item_state = "Re-removed" if not settings.get("dry_run", False) else "Would Re-remove (Dry Run)"
                    continue
            
            # Skip large files if configured
            max_size = parse_size_string_to_bytes(settings.get("ignore_above_size", "25GB"))
            if item["size"] >= max_size:
                swaparr_logger.debug(f"Ignoring large download: {item['name']} ({item['size']} bytes > {max_size} bytes)")
                item_state = "Ignored (Size)"
                SWAPARR_STATS['items_ignored'] += 1
                continue
            
            # Handle delayed items - we'll skip these (respects delay profiles)
            if item["status"] == "delay":
                swaparr_logger.debug(f"Ignoring delayed download: {item['name']}")
                item_state = "Ignored (Delayed)"
                SWAPARR_STATS['items_ignored'] += 1
                continue
            
            # Special handling for "queued" status
            # We only skip truly queued items, not those with metadata issues
            metadata_issue = "metadata" in item["status"].lower() or "metadata" in item["error_message"].lower()
            
            if item["status"] == "queued" and not metadata_issue:
                # For regular queued items, check how long they've been in strike data
                strike_data = load_strike_data(app_name)
                if item_id in strike_data and "first_strike_time" in strike_data[item_id]:
                    first_strike = datetime.fromisoformat(strike_data[item_id]["first_strike_time"].replace('Z', '+00:00'))
                    if (datetime.utcnow() - first_strike) < timedelta(hours=1):
                        # Skip if it's been less than 1 hour since first seeing it
                        swaparr_logger.debug(f"Ignoring recently queued download: {item['name']}")
                        item_state = "Ignored (Recently Queued)"
                        SWAPARR_STATS['items_ignored'] += 1
                        continue
                else:
                    # Initialize with first strike time for queued items
                    if item_id not in strike_data:
                        strike_data[item_id] = {
                            "strikes": 0,
                            "name": item["name"],
                            "first_strike_time": datetime.utcnow().isoformat(),
                            "last_strike_time": None
                        }
                    swaparr_logger.debug(f"Monitoring new queued download: {item['name']}")
                    item_state = "Monitoring (Queued)"
                    continue
            
            # Initialize strike count if not already in strike data
            if item_id not in strike_data:
                strike_data[item_id] = {
                    "strikes": 0,
                    "name": item["name"],
                    "first_strike_time": datetime.utcnow().isoformat(),
                    "last_strike_time": None
                }
            
            # Check if download should be striked
            should_strike = False
            strike_reason = ""
            
            # Strike if metadata issue, eta too long, or no progress (eta = 0 and not queued)
            if metadata_issue:
                should_strike = True
                strike_reason = "Metadata"
            elif item["eta"] >= parse_time_string_to_seconds(settings.get("max_download_time", "2h")):
                should_strike = True
                strike_reason = "ETA too long"
            elif item["eta"] == 0 and item["status"] not in ["queued", "delay"]:
                should_strike = True
                strike_reason = "No progress"
            
            # If we should strike this item, add a strike
            if should_strike:
                strike_data[item_id]["strikes"] += 1
                strike_data[item_id]["last_strike_time"] = datetime.utcnow().isoformat()
                
                if strike_data[item_id]["first_strike_time"] is None:
                    strike_data[item_id]["first_strike_time"] = datetime.utcnow().isoformat()
                
                current_strikes = strike_data[item_id]["strikes"]
                swaparr_logger.info(f"Added strike ({current_strikes}/{settings.get('max_strikes', 3)}) to {item['name']} - Reason: {strike_reason}")
                SWAPARR_STATS['strikes_added'] += 1
                
                # If max strikes reached, remove the download
                if current_strikes >= settings.get('max_strikes', 3):
                    swaparr_logger.warning(f"Max strikes reached for {item['name']}, removing download")
                    
                    if not settings.get("dry_run", False):
                        if delete_download(app_name, instance_data["api_url"], instance_data["api_key"], item["id"], True):
                            swaparr_logger.info(f"Successfully removed {item['name']} after {settings.get('max_strikes', 3)} strikes")
                            
                            # Keep the item in strike data for reference but mark as removed
                            strike_data[item_id]["removed"] = True
                            strike_data[item_id]["removed_time"] = datetime.utcnow().isoformat()
                            
                            # Add to removed items list for persistent tracking
                            removed_items[item_hash] = {
                                "name": item["name"],
                                "size": item["size"],
                                "removed_time": datetime.utcnow().isoformat(),
                                "reason": strike_reason
                            }
                            
                            # Note: Swaparr uses its own statistics system (SWAPARR_STATS), not the hunting stats manager
                    else:
                        swaparr_logger.info(f"DRY RUN: Would have removed {item['name']} after {settings.get('max_strikes', 3)} strikes")
                    
                    item_state = "Removed" if not settings.get("dry_run", False) else "Would Remove (Dry Run)"
                else:
                    item_state = f"Striked ({current_strikes}/{settings.get('max_strikes', 3)})"
            
            swaparr_logger.debug(f"Processed download: {item['name']} - State: {item_state}")
        
        # Save updated strike data
        save_strike_data(app_name, strike_data)
        
        # Save updated removed items list
        save_removed_items(app_name, removed_items)
        
        # Update last run time
        SWAPARR_STATS['last_run_time'] = datetime.utcnow().isoformat()
        
        swaparr_logger.info(f"Finished processing {items_processed_this_run} downloads for {app_name} instance: {instance_name}")
        swaparr_logger.info(f"Session stats - Strikes: {SWAPARR_STATS['strikes_added']}, Removed: {SWAPARR_STATS['downloads_removed']}, Ignored: {SWAPARR_STATS['items_ignored']}, API calls: {SWAPARR_STATS['api_calls_made']}")
        
        return items_processed_this_run
    except Exception as e:
        swaparr_logger.error(f"Error processing {app_name} instance {instance_name}: {str(e)}")
        SWAPARR_STATS['errors_encountered'] += 1
        return 0

def run_swaparr():
    """Run Swaparr cycle to check for stalled downloads in all configured Starr app instances"""
    from src.primary.apps.swaparr import get_configured_instances
    
    settings = load_settings("swaparr")
    
    if not settings or not settings.get("enabled", False):
        swaparr_logger.debug("Swaparr is disabled, skipping processing")
        return
    
    swaparr_logger.info("Starting Swaparr stalled download detection cycle")
    
    instances = get_configured_instances()
    total_instances = sum(len(app_instances) for app_instances in instances.values())
    
    # Count only Swaparr-enabled instances
    swaparr_enabled_count = 0
    for app_name, app_instances in instances.items():
        for app_settings in app_instances:
            if app_settings.get("swaparr_enabled", False):
                swaparr_enabled_count += 1
    
    if swaparr_enabled_count == 0:
        swaparr_logger.info(f"Found {total_instances} configured Starr app instances, but none have Swaparr enabled. Cycle complete.")
        return
    
    swaparr_logger.info(f"Found {swaparr_enabled_count} Swaparr-enabled instances out of {total_instances} total configured Starr app instances")
    
    # Process stalled downloads for each app type and instance
    processed_instances = 0
    swaparr_enabled_instances = 0
    
    for app_name, app_instances in instances.items():
        for app_settings in app_instances:
            # Skip instances that don't have Swaparr enabled
            if not app_settings.get("swaparr_enabled", False):
                swaparr_logger.debug(f"Skipping {app_name} instance '{app_settings.get('instance_name', 'Unknown')}' - Swaparr not enabled for this instance")
                continue
            
            swaparr_enabled_instances += 1
            
            # Check if Swaparr has been disabled during processing
            current_settings = load_settings("swaparr")
            if not current_settings or not current_settings.get("enabled", False):
                swaparr_logger.warning(f"Swaparr was disabled during processing. Ending cycle early after processing {processed_instances}/{swaparr_enabled_instances} Swaparr-enabled instances.")
                return
            
            try:
                items_processed = process_stalled_downloads(app_name, app_settings.get('instance_name', 'Unknown'), app_settings, current_settings)
                processed_instances += 1
                swaparr_logger.debug(f"Processed {items_processed} items from {app_name} instance '{app_settings.get('instance_name', 'Unknown')}'")
            except Exception as e:
                swaparr_logger.error(f"Error processing {app_name} instance {app_settings.get('instance_name', 'Unknown')}: {str(e)}")
                SWAPARR_STATS['errors_encountered'] += 1
                processed_instances += 1
    
    stats = get_session_stats()
    swaparr_logger.info(f"=== SWAPARR cycle completed. Processed {processed_instances} Swaparr-enabled app instances. ===")
    
    # Log summary stats if there was activity
    if stats['total_processed'] > 0:
        swaparr_logger.info(f"Swaparr activity summary: {stats['strikes_added']} strikes added, {stats['downloads_removed']} downloads removed, {stats['items_ignored']} items ignored") 