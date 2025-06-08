#!/usr/bin/env python3
"""
State management module for Huntarr
Handles all persistence of program state
"""

import os
import datetime
import time
import json
from typing import List, Dict, Any, Optional
from src.primary import settings_manager

# Use the centralized path configuration
from src.primary.utils.config_paths import CONFIG_PATH

# Define the config directory - using cross-platform path
CONFIG_DIR = str(CONFIG_PATH)  # Convert to string for compatibility

# Get the logger at module level
from src.primary.utils.logger import get_logger
logger = get_logger("huntarr")

def get_state_file_path(app_type, state_name):
    """
    Get the path to a state file for a specific app type and state name.
    
    Args:
        app_type: The application type (sonarr, radarr, etc.)
        state_name: The name of the state file
        
    Returns:
        The path to the state file
    """
    # Define known app types
    known_app_types = ["sonarr", "radarr", "lidarr", "readarr", "whisparr", "eros"]
    
    # If app_type is not in known types, log a warning but don't fail
    if app_type not in known_app_types and app_type != "general":
        logger.warning(f"get_state_file_path called with unexpected app_type: {app_type}")
    
    # Create the state directory if it doesn't exist
    state_dir = os.path.join(CONFIG_DIR, "state", app_type)
    os.makedirs(state_dir, exist_ok=True)
    
    # Return the path to the state file
    return os.path.join(state_dir, f"{state_name}.json")

def get_last_reset_time(app_type: str = None) -> datetime.datetime:
    """
    Get the last time the state was reset for a specific app type.
    
    Args:
        app_type: The type of app to get last reset time for.
        
    Returns:
        The datetime of the last reset, or current time if no reset has occurred or app_type is invalid.
    """
    if not app_type:
        logger.error("get_last_reset_time called without app_type.")
        return datetime.datetime.now()
        
    current_app_type = app_type
    reset_file = get_state_file_path(current_app_type, "last_reset")
    
    try:
        if os.path.exists(reset_file):
            with open(reset_file, "r") as f:
                reset_time_str = f.read().strip()
                return datetime.datetime.fromisoformat(reset_time_str)
    except Exception as e:
        logger.error(f"Error reading last reset time for {current_app_type}: {e}")
    
    # If no reset file exists, initialize it with current time and return current time
    logger.info(f"No reset time found for {current_app_type}, initializing with current time")
    current_time = datetime.datetime.now()
    set_last_reset_time(current_time, current_app_type)
    return current_time

def set_last_reset_time(reset_time: datetime.datetime, app_type: str = None) -> None:
    """
    Set the last time the state was reset for a specific app type.
    
    Args:
        reset_time: The datetime to set
        app_type: The type of app to set last reset time for.
    """
    if not app_type:
        logger.error("set_last_reset_time called without app_type.")
        return
        
    current_app_type = app_type
    reset_file = get_state_file_path(current_app_type, "last_reset")
    
    try:
        with open(reset_file, "w") as f:
            f.write(reset_time.isoformat())
    except Exception as e:
        logger.error(f"Error writing last reset time for {current_app_type}: {e}")

def check_state_reset(app_type: str = None) -> bool:
    """
    Check if the state needs to be reset based on the reset interval.
    If it's time to reset, clears the processed IDs and updates the last reset time.
    
    Args:
        app_type: The type of app to check state reset for.
        
    Returns:
        True if the state was reset, False otherwise.
    """
    if not app_type:
        logger.error("check_state_reset called without app_type.")
        return False
        
    current_app_type = app_type
    
    # Use a much longer default interval (1 week = 168 hours) to prevent frequent resets
    reset_interval = settings_manager.get_advanced_setting("stateful_management_hours", 168)
    
    last_reset = get_last_reset_time(current_app_type)
    now = datetime.datetime.now()
    
    delta = now - last_reset
    hours_passed = delta.total_seconds() / 3600
    
    # Log every cycle to help diagnose state reset issues
    logger.debug(f"State check for {current_app_type}: {hours_passed:.1f} hours since last reset (interval: {reset_interval}h)")
    
    if hours_passed >= reset_interval:
        logger.warning(f"State files for {current_app_type} will be reset after {hours_passed:.1f} hours (interval: {reset_interval}h)")
        logger.warning(f"This will cause all previously processed media to be eligible for processing again")
        
        # Add additional safeguard - only reset if more than double the interval has passed
        # This helps prevent accidental resets due to clock issues or other anomalies
        if hours_passed >= (reset_interval * 2):
            logger.info(f"Confirmed state reset for {current_app_type} after {hours_passed:.1f} hours")
            clear_processed_ids(current_app_type)
            set_last_reset_time(now, current_app_type)
            return True
        else:
            logger.info(f"State reset postponed for {current_app_type} - will proceed when {reset_interval * 2}h have passed")
            # Update last reset time partially to avoid immediate reset next cycle
            half_delta = datetime.timedelta(hours=reset_interval/2)
            set_last_reset_time(now - half_delta, current_app_type)
            
    return False

def clear_processed_ids(app_type: str = None) -> None:
    """
    Clear all processed IDs for a specific app type.
    
    Args:
        app_type: The type of app to clear processed IDs for.
    """
    if not app_type:
        logger.error("clear_processed_ids called without app_type.")
        return
        
    current_app_type = app_type
    
    missing_file = get_state_file_path(current_app_type, "processed_missing")
    try:
        if os.path.exists(missing_file):
            with open(missing_file, "w") as f:
                f.write("[]")
            logger.info(f"Cleared processed missing IDs for {current_app_type}")
    except Exception as e:
        logger.error(f"Error clearing processed missing IDs for {current_app_type}: {e}")
    
    upgrades_file = get_state_file_path(current_app_type, "processed_upgrades")
    try:
        if os.path.exists(upgrades_file):
            with open(upgrades_file, "w") as f:
                f.write("[]")
            logger.info(f"Cleared processed upgrade IDs for {current_app_type}")
    except Exception as e:
        logger.error(f"Error clearing processed upgrade IDs for {current_app_type}: {e}")

def _get_user_timezone():
    """Get the user's selected timezone from general settings"""
    try:
        from src.primary.utils.timezone_utils import get_user_timezone
        return get_user_timezone()
    except Exception as e:
        logger.warning(f"Could not get user timezone, defaulting to UTC: {e}")
        import pytz
        return pytz.UTC

def calculate_reset_time(app_type: str = None) -> str:
    """
    Calculate when the next state reset will occur.
    
    Args:
        app_type: The type of app to calculate reset time for.
        
    Returns:
        A string representation of when the next reset will occur.
    """
    if not app_type:
        logger.error("calculate_reset_time called without app_type.")
        return "Next reset: Unknown (app type not provided)"
        
    current_app_type = app_type
    
    reset_interval = settings_manager.get_advanced_setting("stateful_management_hours", 168)
    
    last_reset = get_last_reset_time(current_app_type)
    
    # Get user's timezone for consistent time display
    user_tz = _get_user_timezone()
    
    # Convert last reset to user timezone (assuming it was stored as naive UTC)
    import pytz
    if last_reset.tzinfo is None:
        last_reset_utc = pytz.UTC.localize(last_reset)
    else:
        last_reset_utc = last_reset
    
    next_reset = last_reset_utc + datetime.timedelta(hours=reset_interval)
    now_user_tz = datetime.datetime.now(user_tz)
    
    # Convert next_reset to user timezone for comparison
    next_reset_user_tz = next_reset.astimezone(user_tz)
    
    if next_reset_user_tz < now_user_tz:
        return "Next reset: at the start of the next cycle"
    
    delta = next_reset_user_tz - now_user_tz
    hours = delta.total_seconds() / 3600
    
    if hours < 1:
        minutes = delta.total_seconds() / 60
        return f"Next reset: in {int(minutes)} minutes"
    elif hours < 24:
        return f"Next reset: in {int(hours)} hours"
    else:
        days = hours / 24
        return f"Next reset: in {int(days)} days"

def load_processed_ids(filepath: str) -> List[int]:
    """
    Load processed IDs from a file.
    
    Args:
        filepath: The path to the file
        
    Returns:
        A list of processed IDs
    """
    try:
        if os.path.exists(filepath):
            with open(filepath, "r") as f:
                loaded_data = json.load(f)
                if isinstance(loaded_data, list):
                    return loaded_data
                else:
                    logger.error(f"Invalid data type loaded from {filepath}. Expected list, got {type(loaded_data)}. Returning empty list.")
                    return []
        return []
    except json.JSONDecodeError as e:
        logger.error(f"Error decoding JSON from {filepath}: {e}. Returning empty list.")
        return [] # Ensure list is returned even on JSON error
    except Exception as e:
        logger.error(f"Error loading processed IDs from {filepath}: {e}")
        return []

def save_processed_ids(filepath: str, ids: List[int]) -> None:
    """
    Save processed IDs to a file.
    
    Args:
        filepath: The path to the file
        ids: The list of IDs to save
    """
    try:
        with open(filepath, "w") as f:
            json.dump(ids, f)
    except Exception as e:
        logger.error(f"Error saving processed IDs to {filepath}: {e}")

def save_processed_id(filepath: str, item_id: int) -> None:
    """
    Add a single ID to a processed IDs file.
    
    Args:
        filepath: The path to the file
        item_id: The ID to add
    """
    processed_ids = load_processed_ids(filepath)
    
    if item_id not in processed_ids:
        processed_ids.append(item_id)
        save_processed_ids(filepath, processed_ids)

def reset_state_file(app_type: str, state_type: str) -> bool:
    """
    Reset a specific state file for an app type.
    
    Args:
        app_type: The type of app (sonarr, radarr, etc.)
        state_type: The type of state file (processed_missing, processed_upgrades)
        
    Returns:
        True if successful, False otherwise
    """
    if not app_type:
        logger.error("reset_state_file called without app_type.")
        return False
        
    filepath = get_state_file_path(app_type, state_type)
    
    try:
        save_processed_ids(filepath, [])
        logger.info(f"Reset {state_type} state file for {app_type}")
        return True
    except Exception as e:
        logger.error(f"Error resetting {state_type} state file for {app_type}: {e}")
        return False

def truncate_processed_list(filepath: str, max_items: int = 1000) -> None:
    """
    Truncate a processed IDs list to a maximum number of items.
    This helps prevent the file from growing too large over time.
    
    Args:
        filepath: The path to the file
        max_items: The maximum number of items to keep
    """
    processed_ids = load_processed_ids(filepath)
    
    if len(processed_ids) > max_items:
        processed_ids = processed_ids[-max_items:]
        save_processed_ids(filepath, processed_ids)
        logger.debug(f"Truncated {filepath} to {max_items} items")

def init_state_files() -> None:
    """Initialize state files for all app types"""
    app_types = settings_manager.KNOWN_APP_TYPES 
    
    for app_type in app_types:
        missing_file = get_state_file_path(app_type, "processed_missing")
        upgrades_file = get_state_file_path(app_type, "processed_upgrades")
        reset_file = get_state_file_path(app_type, "last_reset")
        
        for filepath in [missing_file, upgrades_file]:
            if not os.path.exists(filepath):
                save_processed_ids(filepath, [])
        
        if not os.path.exists(reset_file):
             set_last_reset_time(datetime.datetime.fromtimestamp(0), app_type)

init_state_files()