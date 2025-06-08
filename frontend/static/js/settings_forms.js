/*
 * Settings forms for Huntarr
 * This file handles generating HTML forms for each app's settings
 */

const SettingsForms = {
    // Generate Sonarr settings form
    generateSonarrForm: function(container, settings = {}) {
        // Add data-app-type attribute to container
        container.setAttribute('data-app-type', 'sonarr');
        
        // Make sure the instances array exists
        if (!settings.instances || !Array.isArray(settings.instances) || settings.instances.length === 0) {
            settings.instances = [{
                name: "Default",
                api_url: settings.api_url || "", // Legacy support
                api_key: settings.api_key || "", // Legacy support
                enabled: true
            }];
        }

        // Create a container for instances
        let instancesHtml = `
            <div class="settings-group">
                <h3>Sonarr Instances</h3>
                <div class="instances-container">
        `;

        // Generate form elements for each instance
        settings.instances.forEach((instance, index) => {
            instancesHtml += `
                <div class="instance-item" data-instance-id="${index}">
                    <div class="instance-header">
                        <h4>Instance ${index + 1}: ${instance.name || 'Unnamed'}</h4>
                        <div class="instance-actions">
                            ${index > 0 ? '<button type="button" class="remove-instance-btn">Remove</button>' : ''}
                            <button type="button" class="test-connection-btn" data-instance="${index}" style="margin-left: 10px;">
                                <i class="fas fa-plug"></i> Test Connection
                            </button>
                        </div>
                    </div>
                    <div class="instance-content">
                        <div class="setting-item">
                            <label for="sonarr-name-${index}"><a href="/Huntarr.io/docs/#/guides/multi-instance?id=naming-instances" class="info-icon" title="Learn more about naming your Sonarr instance" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Name:</label>
                            <input type="text" id="sonarr-name-${index}" name="name" value="${instance.name || ''}" placeholder="Friendly name for this Sonarr instance">
                            <p class="setting-help">Friendly name for this Sonarr instance</p>
                        </div>
                        <div class="setting-item">
                            <label for="sonarr-url-${index}"><a href="https://huntarr.io/threads/sonarr-missing-search-mode.16/" class="info-icon" title="Learn more about Sonarr URL configuration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>URL:</label>
                            <input type="text" id="sonarr-url-${index}" name="api_url" value="${instance.api_url || ''}" placeholder="Base URL for Sonarr (e.g., http://localhost:8989)">
                            <p class="setting-help">Base URL for Sonarr (e.g., http://localhost:8989)</p>
                        </div>
                        <div class="setting-item">
                            <label for="sonarr-key-${index}"><a href="/Huntarr.io/docs/#/installation?id=api-keys" class="info-icon" title="Learn more about finding your Sonarr API key" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Key:</label>
                            <input type="text" id="sonarr-key-${index}" name="api_key" value="${instance.api_key || ''}" placeholder="API key for Sonarr">
                            <p class="setting-help">API key for Sonarr</p>
                        </div>
                        <div class="setting-item">
                            <label for="sonarr-enabled-${index}"><a href="/Huntarr.io/docs/#/guides/multi-instance?id=enabling-disabling-instances" class="info-icon" title="Learn more about enabling/disabling instances" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Enabled:</label>
                            <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                                <input type="checkbox" id="sonarr-enabled-${index}" name="enabled" ${instance.enabled !== false ? 'checked' : ''}>
                                <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                            </label>
                        </div>
                    </div>
                </div>
            `;
        });

        instancesHtml += `
                </div> <!-- instances-container -->
                <div class="button-container" style="text-align: center; margin-top: 15px;">
                    <button type="button" class="add-instance-btn add-sonarr-instance-btn">
                        <i class="fas fa-plus"></i> Add Sonarr Instance (${settings.instances.length}/9)
                    </button>
                </div>
            </div> <!-- settings-group -->
        `;

        // Search Settings
        let searchSettingsHtml = `
            <div class="settings-group">
                <h3>Search Settings</h3>
                <div class="setting-item">
                    <label for="sonarr-hunt-missing-mode"><a href="https://huntarr.io/threads/sonarr-missing-search-mode.16/" class="info-icon" title="Learn more about missing search modes" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Missing Search Mode:</label>
                    <select id="sonarr-hunt-missing-mode" name="hunt_missing_mode">
                        <option value="seasons_packs" ${settings.hunt_missing_mode === 'seasons_packs' || !settings.hunt_missing_mode ? 'selected' : ''}>Season Packs</option>
                        <option value="shows" ${settings.hunt_missing_mode === 'shows' ? 'selected' : ''}>Shows</option>
                        <option value="episodes" ${settings.hunt_missing_mode === 'episodes' ? 'selected' : ''}>Episodes</option>
                    </select>
                    <p class="setting-help">How to search for missing Sonarr content (Season Packs recommended for all users)</p>
                    <p class="setting-help" style="color: #cc7a00; font-weight: bold; display: ${settings.hunt_missing_mode === 'episodes' ? 'block' : 'none'};" id="episodes-missing-warning">⚠️ Episodes mode makes excessive API calls and does not support tagging. Use only for targeting specific episodes. Season Packs mode is strongly recommended.</p>
                </div>
                <div class="setting-item">
                    <label for="sonarr-upgrade-mode"><a href="/Huntarr.io/docs/#/configuration?id=upgrade-modes" class="info-icon" title="Learn more about upgrade modes" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Upgrade Mode:</label>
                    <select id="sonarr-upgrade-mode" name="upgrade_mode">
                        <option value="seasons_packs" ${settings.upgrade_mode === 'seasons_packs' || !settings.upgrade_mode ? 'selected' : ''}>Season Packs</option>
                        <option value="episodes" ${settings.upgrade_mode === 'episodes' ? 'selected' : ''}>Episodes</option>
                    </select>
                    <p class="setting-help">How to search for Sonarr upgrades (Season Packs mode recommended)</p>
                    <p class="setting-help" style="color: #cc7a00; font-weight: bold; display: ${settings.upgrade_mode === 'episodes' ? 'block' : 'none'};" id="episodes-upgrade-warning">⚠️ Episodes mode makes excessive API calls and does not support tagging. Use only for targeting specific episodes. Season Packs mode is strongly recommended.</p>
                </div>
                <div class="setting-item">
                    <label for="sonarr-hunt-missing-items"><a href="/Huntarr.io/docs/#/configuration?id=missing-items-search" class="info-icon" title="Learn more about missing items search" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Missing Search:</label>
                    <input type="number" id="sonarr-hunt-missing-items" name="hunt_missing_items" min="0" value="${settings.hunt_missing_items !== undefined ? settings.hunt_missing_items : 1}">
                    <p class="setting-help">Number of missing items to search per cycle (0 to disable)</p>
                </div>
                <div class="setting-item">
                    <label for="sonarr-hunt-upgrade-items"><a href="https://huntarr.io" class="info-icon" title="Learn more about upgrade items search" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Upgrade Search:</label>
                    <input type="number" id="sonarr-hunt-upgrade-items" name="hunt_upgrade_items" min="0" value="${settings.hunt_upgrade_items !== undefined ? settings.hunt_upgrade_items : 0}">
                    <p class="setting-help">Number of episodes to upgrade per cycle (0 to disable)</p>
                </div>
                <div class="setting-item">
                    <label for="sonarr_sleep_duration"><a href="/Huntarr.io/docs/#/configuration?id=sleep-duration" class="info-icon" title="Learn more about sleep duration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Sleep Duration:</label>
                    <input type="number" id="sonarr_sleep_duration" name="sleep_duration" min="60" value="${settings.sleep_duration !== undefined ? settings.sleep_duration : 900}">
                    <p class="setting-help">Time in seconds between processing cycles</p>
                </div>
                <div class="setting-item">
                    <label for="sonarr_hourly_cap"><a href="#" class="info-icon" title="Maximum API requests per hour for this app" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Cap - Hourly:</label>
                    <input type="number" id="sonarr_hourly_cap" name="hourly_cap" min="1" max="500" value="${settings.hourly_cap !== undefined ? settings.hourly_cap : 20}">
                    <p class="setting-help">Maximum API requests per hour (helps prevent rate limiting)</p>
                    <p class="setting-help" style="color: #cc0000; font-weight: bold;">Setting this too high will risk your accounts being banned! You have been warned!</p>
                </div>
            </div>
            
            <div class="settings-group">
                <h3>Additional Options</h3>
                <div class="setting-item">
                    <label for="sonarr_monitored_only"><a href="/Huntarr.io/docs/#/configuration?id=monitored-only" class="info-icon" title="Learn more about monitored only option" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Monitored Only:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="sonarr_monitored_only" name="monitored_only" ${settings.monitored_only !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Only search for monitored items</p>
                </div>
                <div class="setting-item">
                    <label for="sonarr_skip_future_episodes"><a href="https://huntarr.io" class="info-icon" title="Learn more about skipping future episodes" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Skip Future Episodes:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="sonarr_skip_future_episodes" name="skip_future_episodes" ${settings.skip_future_episodes !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Skip searching for episodes with future air dates</p>
                </div>
                <div class="setting-item">
                    <label for="sonarr_tag_processed_items"><a href="https://github.com/plexguide/Huntarr.io/issues/382" class="info-icon" title="Learn more about tagging processed items" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Tag Processed Items:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="sonarr_tag_processed_items" name="tag_processed_items" ${settings.tag_processed_items !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Automatically tag series: "huntarr-s{season}" for season packs mode, "huntarr-show-processed" for shows mode</p>
                </div>
            </div>
        `;

        // Set the content
        container.innerHTML = instancesHtml + searchSettingsHtml;

        // Setup instance management (add/remove/test)
        SettingsForms.setupInstanceManagement(container, 'sonarr', settings.instances.length);
        
        // Add event listeners for episode mode warnings
        const huntMissingModeSelect = container.querySelector('#sonarr-hunt-missing-mode');
        const upgradeModelSelect = container.querySelector('#sonarr-upgrade-mode');
        const episodesMissingWarning = container.querySelector('#episodes-missing-warning');
        const episodesUpgradeWarning = container.querySelector('#episodes-upgrade-warning');
        
        if (huntMissingModeSelect && episodesMissingWarning) {
            huntMissingModeSelect.addEventListener('change', function() {
                if (this.value === 'episodes') {
                    episodesMissingWarning.style.display = 'block';
                } else {
                    episodesMissingWarning.style.display = 'none';
                }
            });
        }
        
        if (upgradeModelSelect && episodesUpgradeWarning) {
            upgradeModelSelect.addEventListener('change', function() {
                if (this.value === 'episodes') {
                    episodesUpgradeWarning.style.display = 'block';
                } else {
                    episodesUpgradeWarning.style.display = 'none';
                }
            });
        }
    },
    
    // Generate Radarr settings form
    generateRadarrForm: function(container, settings = {}) {
        // Add data-app-type attribute to container
        container.setAttribute('data-app-type', 'radarr');
        
        // Make sure the instances array exists
        if (!settings.instances || !Array.isArray(settings.instances) || settings.instances.length === 0) {
            settings.instances = [{
                name: "Default",
                api_url: settings.api_url || "",
                api_key: settings.api_key || "",
                enabled: true
            }];
        }
        
        // Create a container for instances with a scrollable area for many instances
        let instancesHtml = `
            <div class="settings-group">
                <h3>Radarr Instances</h3>
                <div class="instances-container">
        `;
        
        // Generate form elements for each instance
        settings.instances.forEach((instance, index) => {
            instancesHtml += `
                <div class="instance-item" data-instance-id="${index}">
                    <div class="instance-header">
                        <h4>Instance ${index + 1}: ${instance.name || 'Unnamed'}</h4>
                        <div class="instance-actions">
                            ${index > 0 ? '<button type="button" class="remove-instance-btn">Remove</button>' : ''}
                            <button type="button" class="test-connection-btn" data-instance="${index}" style="margin-left: 10px;">
                                <i class="fas fa-plug"></i> Test Connection
                            </button>
                        </div>
                    </div>
                    <div class="instance-content">
                        <div class="setting-item">
                            <label for="radarr-name-${index}"><a href="https://huntarr.io/threads/name-field.18/" class="info-icon" title="Learn more about naming your Radarr instance" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Name:</label>
                            <input type="text" id="radarr-name-${index}" name="name" value="${instance.name || ''}" placeholder="Friendly name for this Radarr instance">
                            <p class="setting-help">Friendly name for this Radarr instance</p>
                        </div>
                        <div class="setting-item">
                            <label for="radarr-url-${index}"><a href="https://huntarr.io/threads/url.19/" class="info-icon" title="Learn more about Radarr URL configuration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>URL:</label>
                            <input type="text" id="radarr-url-${index}" name="api_url" value="${instance.api_url || ''}" placeholder="Base URL for Radarr (e.g., http://localhost:7878)">
                            <p class="setting-help">Base URL for Radarr (e.g., http://localhost:7878)</p>
                        </div>
                        <div class="setting-item">
                            <label for="radarr-key-${index}"><a href="https://huntarr.io/threads/api-key.20/" class="info-icon" title="Learn more about finding your Radarr API key" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Key:</label>
                            <input type="text" id="radarr-key-${index}" name="api_key" value="${instance.api_key || ''}" placeholder="API key for Radarr">
                            <p class="setting-help">API key for Radarr</p>
                        </div>
                        <div class="setting-item">
                            <label for="radarr-enabled-${index}"><a href="https://huntarr.io/threads/enable-toggle.21/" class="info-icon" title="Learn more about enabling/disabling instances" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Enabled:</label>
                            <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                                <input type="checkbox" id="radarr-enabled-${index}" name="enabled" ${instance.enabled !== false ? 'checked' : ''}>
                                <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                            </label>
                        </div>
                    </div>
                </div>
            `;
        });

        // Add a button to add new instances (limit to 9 total)
        instancesHtml += `
                </div> <!-- instances-container -->
                <div class="button-container" style="text-align: center; margin-top: 15px;">
                    <button type="button" class="add-instance-btn add-radarr-instance-btn">
                        <i class="fas fa-plus"></i> Add Radarr Instance (${settings.instances.length}/9)
                    </button>
                </div>
            </div> <!-- settings-group -->
        `;
        
        // Continue with the rest of the settings form
        let searchSettingsHtml = `
            <div class="settings-group">
                <h3>Search Settings</h3>
                <div class="setting-item">
                    <label for="radarr_hunt_missing_movies"><a href="https://huntarr.io" class="info-icon" title="Learn more about missing movies search" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Missing Search:</label>
                    <input type="number" id="radarr_hunt_missing_movies" name="hunt_missing_movies" min="0" value="${settings.hunt_missing_movies !== undefined ? (settings.hunt_missing_movies === 0 ? 0 : settings.hunt_missing_movies) : 1}">
                    <p class="setting-help">Number of missing movies to search per cycle (0 to disable)</p>
                </div>
                <div class="setting-item">
                    <label for="radarr_hunt_upgrade_movies"><a href="https://huntarr.io" class="info-icon" title="Learn more about upgrading movies" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Upgrade Search:</label>
                    <input type="number" id="radarr_hunt_upgrade_movies" name="hunt_upgrade_movies" min="0" value="${settings.hunt_upgrade_movies !== undefined ? (settings.hunt_upgrade_movies === 0 ? 0 : settings.hunt_upgrade_movies) : 0}">
                    <p class="setting-help">Number of movies to search for quality upgrades per cycle (0 to disable)</p>
                </div>
                <div class="setting-item">
                    <label for="radarr_sleep_duration"><a href="/Huntarr.io/docs/#/configuration?id=sleep-duration" class="info-icon" title="Learn more about sleep duration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Sleep Duration:</label>
                    <input type="number" id="radarr_sleep_duration" name="sleep_duration" min="60" value="${settings.sleep_duration !== undefined ? settings.sleep_duration : 900}">
                    <p class="setting-help">Time in seconds between processing cycles</p>
                </div>
                <div class="setting-item">
                    <label for="radarr_hourly_cap"><a href="#" class="info-icon" title="Maximum API requests per hour for this app" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Cap - Hourly:</label>
                    <input type="number" id="radarr_hourly_cap" name="hourly_cap" min="1" max="500" value="${settings.hourly_cap !== undefined ? settings.hourly_cap : 20}">
                    <p class="setting-help">Maximum API requests per hour (helps prevent rate limiting)</p>
                    <p class="setting-help" style="color: #cc0000; font-weight: bold;">Setting this too high will risk your accounts being banned! You have been warned!</p>
                </div>
            </div>
            
            <div class="settings-group">
                <h3>Additional Options</h3>
                <div class="setting-item">
                    <label for="radarr_monitored_only"><a href="/Huntarr.io/docs/#/configuration?id=monitored-only" class="info-icon" title="Learn more about monitored only option" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Monitored Only:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="radarr_monitored_only" ${settings.monitored_only !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Only search for monitored items</p>
                </div>
                <div class="setting-item">
                    <label for="radarr_skip_future_releases"><a href="https://huntarr.io" class="info-icon" title="Learn more about skipping future releases" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Skip Future Releases:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="radarr_skip_future_releases" ${settings.skip_future_releases !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Skip searching for movies with future release dates</p>
                </div>
                <div class="setting-item" id="future_release_type_container" style="${settings.skip_future_releases !== false ? '' : 'display: none;'}">
                    <label for="radarr_release_type"><a href="https://huntarr.io/threads/radarr-release-type.24/" class="info-icon" title="Learn more about release type options" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Release Type for Future Status:</label>
                    <select id="radarr_release_type">
                        <option value="digital" ${settings.release_type === 'digital' ? 'selected' : ''}>Digital Release</option>
                        <option value="physical" ${settings.release_type === 'physical' || !settings.release_type ? 'selected' : ''}>Physical Release</option>
                        <option value="cinema" ${settings.release_type === 'cinema' ? 'selected' : ''}>Cinema Release</option>
                    </select>
                    <p class="setting-help">Select which release date type to use when determining if a movie is considered a future release</p>
                </div>
                <div class="setting-item">
                    <label for="radarr_tag_processed_items"><a href="https://github.com/plexguide/Huntarr.io/issues/382" class="info-icon" title="Learn more about tagging processed items" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Tag Processed Items:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="radarr_tag_processed_items" name="tag_processed_items" ${settings.tag_processed_items !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Automatically tag movies with "huntarr-processed" after successful searches</p>
                </div>
            </div>
        `;

        // Set the content
        container.innerHTML = instancesHtml + searchSettingsHtml;

        // Add event listeners for the instance management
        this.setupInstanceManagement(container, 'radarr', settings.instances.length);
        
        // Set up event listeners for the skip_future_releases checkbox
        const skipFutureCheckbox = container.querySelector('#radarr_skip_future_releases');
        const releaseTypeContainer = container.querySelector('#future_release_type_container');
        
        if (skipFutureCheckbox) {
            skipFutureCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    releaseTypeContainer.style.display = '';
                } else {
                    releaseTypeContainer.style.display = 'none';
                }
            });
        }
    },
    
    // Generate Lidarr settings form
    generateLidarrForm: function(container, settings = {}) {
        // Add data-app-type attribute to container
        container.setAttribute('data-app-type', 'lidarr');
        
        // Make sure the instances array exists
        if (!settings.instances || !Array.isArray(settings.instances) || settings.instances.length === 0) {
            settings.instances = [{
                name: "Default",
                api_url: settings.api_url || "", // Legacy support
                api_key: settings.api_key || "", // Legacy support
                enabled: true
            }];
        }
        
        // Create a container for instances
        let instancesHtml = `
            <div class="settings-group">
                <h3>Lidarr Instances</h3>
                <div class="instances-container">
        `;
        
        // Generate form elements for each instance
        settings.instances.forEach((instance, index) => {
            instancesHtml += `
                <div class="instance-item" data-instance-id="${index}">
                    <div class="instance-header">
                        <h4>Instance ${index + 1}: ${instance.name || 'Unnamed'}</h4>
                        <div class="instance-actions">
                            ${index > 0 ? '<button type="button" class="remove-instance-btn">Remove</button>' : ''}
                            <button type="button" class="test-connection-btn" data-instance="${index}" style="margin-left: 10px;">
                                <i class="fas fa-plug"></i> Test Connection
                            </button>
                        </div>
                    </div>
                    <div class="instance-content">
                        <div class="setting-item">
                            <label for="lidarr-name-${index}"><a href="https://huntarr.io/threads/name-field.18/" class="info-icon" title="Learn more about naming your Lidarr instance" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Name:</label>
                            <input type="text" id="lidarr-name-${index}" name="name" value="${instance.name || ''}" placeholder="Friendly name for this Lidarr instance">
                            <p class="setting-help">Friendly name for this Lidarr instance</p>
                        </div>
                        <div class="setting-item">
                            <label for="lidarr-url-${index}"><a href="https://huntarr.io/threads/url.19/" class="info-icon" title="Learn more about Lidarr URL configuration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>URL:</label>
                            <input type="text" id="lidarr-url-${index}" name="api_url" value="${instance.api_url || ''}" placeholder="Base URL for Lidarr (e.g., http://localhost:8686)">
                            <p class="setting-help">Base URL for Lidarr (e.g., http://localhost:8686)</p>
                        </div>
                        <div class="setting-item">
                            <label for="lidarr-key-${index}"><a href="https://huntarr.io/threads/api-key.20/" class="info-icon" title="Learn more about finding your Lidarr API key" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Key:</label>
                            <input type="text" id="lidarr-key-${index}" name="api_key" value="${instance.api_key || ''}" placeholder="API key for Lidarr">
                            <p class="setting-help">API key for Lidarr</p>
                        </div>
                        <div class="setting-item">
                            <label for="lidarr-enabled-${index}"><a href="https://huntarr.io/threads/enable-toggle.21/" class="info-icon" title="Learn more about enabling/disabling instances" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Enabled:</label>
                            <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                                <input type="checkbox" id="lidarr-enabled-${index}" name="enabled" ${instance.enabled !== false ? 'checked' : ''}>
                                <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                            </label>
                        </div>
                    </div>
                </div>
            `;
        });

        instancesHtml += `
                </div> <!-- instances-container -->
                <div class="button-container" style="text-align: center; margin-top: 15px;">
                    <button type="button" class="add-instance-btn add-lidarr-instance-btn">
                        <i class="fas fa-plus"></i> Add Lidarr Instance (${settings.instances.length}/9)
                    </button>
                </div>
            </div> <!-- settings-group -->
        `;
        
        // Continue with the rest of the settings form
        container.innerHTML = `
            ${instancesHtml}
            
            <div class="settings-group">
                <h3>Search Settings</h3>
                <div class="setting-item">
                    <label for="lidarr_hunt_missing_mode"><a href="https://huntarr.io" class="info-icon" title="Learn more about missing search modes" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Missing Search Mode:</label>
                    <select id="lidarr_hunt_missing_mode" name="hunt_missing_mode">
                        <option value="album" selected>Album</option>
                    </select>
                    <p class="setting-help">Search for individual albums (Artist mode deprecated in Huntarr 7.5.0+)</p>
                </div>
                <div class="setting-item">
                    <label for="lidarr_hunt_missing_items"><a href="https://huntarr.io" class="info-icon" title="Learn more about missing items search" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Missing Search:</label>
                    <input type="number" id="lidarr_hunt_missing_items" name="hunt_missing_items" min="0" value="${settings.hunt_missing_items !== undefined ? settings.hunt_missing_items : 1}">
                    <p class="setting-help">Number of artists with missing albums to search per cycle (0 to disable)</p>
                </div>
                
                <div class="setting-item">
                    <label for="lidarr_hunt_upgrade_items"><a href="https://huntarr.io" class="info-icon" title="Learn more about upgrading items" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Upgrade Search:</label>
                    <input type="number" id="lidarr_hunt_upgrade_items" name="hunt_upgrade_items" min="0" value="${settings.hunt_upgrade_items !== undefined ? settings.hunt_upgrade_items : 0}">
                    <p class="setting-help">Number of albums to search for quality upgrades per cycle (0 to disable)</p>
                </div>
                <div class="setting-item">
                    <label for="lidarr_sleep_duration"><a href="/Huntarr.io/docs/#/configuration?id=sleep-duration" class="info-icon" title="Learn more about sleep duration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Sleep Duration:</label>
                    <input type="number" id="lidarr_sleep_duration" name="sleep_duration" min="60" value="${settings.sleep_duration !== undefined ? settings.sleep_duration : 900}">
                    <p class="setting-help">Time in seconds between processing cycles</p>
                </div>
                <div class="setting-item">
                    <label for="lidarr_hourly_cap"><a href="#" class="info-icon" title="Maximum API requests per hour for this app" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Cap - Hourly:</label>
                    <input type="number" id="lidarr_hourly_cap" name="hourly_cap" min="1" max="500" value="${settings.hourly_cap !== undefined ? settings.hourly_cap : 20}">
                    <p class="setting-help">Maximum API requests per hour (helps prevent rate limiting)</p>
                    <p class="setting-help" style="color: #cc0000; font-weight: bold;">Setting this too high will risk your accounts being banned! You have been warned!</p>
                </div>
            </div>
            
            <div class="settings-group">
                <h3>Additional Options</h3>
                <div class="setting-item">
                    <label for="lidarr_monitored_only"><a href="/Huntarr.io/docs/#/configuration?id=monitored-only" class="info-icon" title="Learn more about monitored only option" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Monitored Only:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="lidarr_monitored_only" ${settings.monitored_only !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Only search for monitored items</p>
                </div>
                <div class="setting-item">
                    <label for="lidarr_skip_future_releases"><a href="https://huntarr.io" class="info-icon" title="Learn more about skipping future releases" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Skip Future Releases:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="lidarr_skip_future_releases" ${settings.skip_future_releases !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Skip searching for albums with future release dates</p>
                </div>
                <div class="setting-item">
                    <label for="lidarr_tag_processed_items"><a href="https://github.com/plexguide/Huntarr.io/issues/382" class="info-icon" title="Learn more about tagging processed items" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Tag Processed Items:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="lidarr_tag_processed_items" name="tag_processed_items" ${settings.tag_processed_items !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Automatically tag artists with "huntarr-{albumname}" after successful searches</p>
                </div>
            </div>
        `;

        // Add event listeners for the instance management
        SettingsForms.setupInstanceManagement(container, 'lidarr', settings.instances.length);
    },
    
    // Generate Readarr settings form
    generateReadarrForm: function(container, settings = {}) {
        // Add data-app-type attribute to container
        container.setAttribute('data-app-type', 'readarr');
        
        // Make sure the instances array exists
        if (!settings.instances || !Array.isArray(settings.instances) || settings.instances.length === 0) {
            settings.instances = [{
                name: "Default",
                api_url: settings.api_url || "", // Legacy support
                api_key: settings.api_key || "", // Legacy support
                enabled: true
            }];
        }
        
        // Create a container for instances
        let instancesHtml = `
            <div class="settings-group">
                <h3>Readarr Instances</h3>
                <div class="instances-container">
        `;
        
        // Generate form elements for each instance
        settings.instances.forEach((instance, index) => {
            instancesHtml += `
                <div class="instance-item" data-instance-id="${index}">
                    <div class="instance-header">
                        <h4>Instance ${index + 1}: ${instance.name || 'Unnamed'}</h4>
                        <div class="instance-actions">
                            ${index > 0 ? '<button type="button" class="remove-instance-btn">Remove</button>' : ''}
                            <button type="button" class="test-connection-btn" data-instance="${index}" style="margin-left: 10px;">
                                <i class="fas fa-plug"></i> Test Connection
                            </button>
                        </div>
                    </div>
                    <div class="instance-content">
                        <div class="setting-item">
                            <label for="readarr-name-${index}"><a href="https://huntarr.io/threads/name-field.18/" class="info-icon" title="Learn more about naming your Readarr instance" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Name:</label>
                            <input type="text" id="readarr-name-${index}" name="name" value="${instance.name || ''}" placeholder="Friendly name for this Readarr instance">
                            <p class="setting-help">Friendly name for this Readarr instance</p>
                        </div>
                        <div class="setting-item">
                            <label for="readarr-url-${index}"><a href="https://huntarr.io/threads/url.19/" class="info-icon" title="Learn more about Readarr URL configuration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>URL:</label>
                            <input type="text" id="readarr-url-${index}" name="api_url" value="${instance.api_url || ''}" placeholder="Base URL for Readarr (e.g., http://localhost:8787)">
                            <p class="setting-help">Base URL for Readarr (e.g., http://localhost:8787)</p>
                        </div>
                        <div class="setting-item">
                            <label for="readarr-key-${index}"><a href="https://huntarr.io/threads/api-key.20/" class="info-icon" title="Learn more about finding your Readarr API key" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Key:</label>
                            <input type="text" id="readarr-key-${index}" name="api_key" value="${instance.api_key || ''}" placeholder="API key for Readarr">
                            <p class="setting-help">API key for Readarr</p>
                        </div>
                        <div class="setting-item">
                            <label for="readarr-enabled-${index}"><a href="https://huntarr.io/threads/enable-toggle.21/" class="info-icon" title="Learn more about enabling/disabling instances" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Enabled:</label>
                            <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                                <input type="checkbox" id="readarr-enabled-${index}" name="enabled" ${instance.enabled !== false ? 'checked' : ''}>
                                <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                            </label>
                        </div>
                    </div>
                </div>
            `;
        });

        instancesHtml += `
                </div> <!-- instances-container -->
                <div class="button-container" style="text-align: center; margin-top: 15px;">
                    <button type="button" class="add-instance-btn add-readarr-instance-btn">
                        <i class="fas fa-plus"></i> Add Readarr Instance (${settings.instances.length}/9)
                    </button>
                </div>
            </div> <!-- settings-group -->
        `;
        
        // Continue with the rest of the settings form
        container.innerHTML = `
            ${instancesHtml}
            
            <div class="settings-group">
                <h3>Search Settings</h3>
                <div class="setting-item">
                    <label for="readarr_hunt_missing_books"><a href="https://huntarr.io" class="info-icon" title="Learn more about missing books search" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Missing Search:</label>
                    <input type="number" id="readarr_hunt_missing_books" name="hunt_missing_books" min="0" value="${settings.hunt_missing_books !== undefined ? settings.hunt_missing_books : 1}">
                    <p class="setting-help">Number of missing books to search per cycle (0 to disable)</p>
                </div>
                <div class="setting-item">
                    <label for="readarr_hunt_upgrade_books"><a href="https://huntarr.io" class="info-icon" title="Learn more about upgrading books" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Upgrade Search:</label>
                    <input type="number" id="readarr_hunt_upgrade_books" name="hunt_upgrade_books" min="0" value="${settings.hunt_upgrade_books !== undefined ? settings.hunt_upgrade_books : 0}">
                    <p class="setting-help">Number of books to search for quality upgrades per cycle (0 to disable)</p>
                </div>
                <div class="setting-item">
                    <label for="readarr_sleep_duration"><a href="/Huntarr.io/docs/#/configuration?id=sleep-duration" class="info-icon" title="Learn more about sleep duration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Sleep Duration:</label>
                    <input type="number" id="readarr_sleep_duration" name="sleep_duration" min="60" value="${settings.sleep_duration !== undefined ? settings.sleep_duration : 900}">
                    <p class="setting-help">Time in seconds between processing cycles</p>
                </div>
                <div class="setting-item">
                    <label for="readarr_hourly_cap"><a href="#" class="info-icon" title="Maximum API requests per hour for this app" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Cap - Hourly:</label>
                    <input type="number" id="readarr_hourly_cap" name="hourly_cap" min="1" max="500" value="${settings.hourly_cap !== undefined ? settings.hourly_cap : 20}">
                    <p class="setting-help">Maximum API requests per hour (helps prevent rate limiting)</p>
                    <p class="setting-help" style="color: #cc0000; font-weight: bold;">Setting this too high will risk your accounts being banned! You have been warned!</p>
                </div>
            </div>
            
            <div class="settings-group">
                <h3>Additional Options</h3>
                <div class="setting-item">
                    <label for="readarr_monitored_only"><a href="/Huntarr.io/docs/#/configuration?id=monitored-only" class="info-icon" title="Learn more about monitored only option" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Monitored Only:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="readarr_monitored_only" ${settings.monitored_only !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Only search for monitored items</p>
                </div>
                <div class="setting-item">
                    <label for="readarr_skip_future_releases"><a href="https://huntarr.io" class="info-icon" title="Learn more about skipping future releases" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Skip Future Releases:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="readarr_skip_future_releases" ${settings.skip_future_releases !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Skip searching for books with future release dates</p>
                </div>
                <div class="setting-item">
                    <label for="readarr_tag_processed_items"><a href="https://github.com/plexguide/Huntarr.io/issues/382" class="info-icon" title="Learn more about tagging processed items" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Tag Processed Items:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="readarr_tag_processed_items" name="tag_processed_items" ${settings.tag_processed_items !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Automatically tag authors with "huntarr-processed" after successful searches</p>
                </div>
            </div>
        `;

        // Add event listeners for the instance management
        SettingsForms.setupInstanceManagement(container, 'readarr', settings.instances.length);
    },
    
    // Generate Whisparr settings form
    generateWhisparrForm: function(container, settings = {}) {
        // Add data-app-type attribute to container
        container.setAttribute('data-app-type', 'whisparr');
        
        // Make sure the instances array exists
        if (!settings.instances || !Array.isArray(settings.instances) || settings.instances.length === 0) {
            settings.instances = [{
                name: "Default",
                api_url: "",
                api_key: "",
                enabled: true
            }];
        }

        // Create a container for instances
        let instancesHtml = `
            <div class="settings-group">
                <h3>Whisparr V2 Instances</h3>
                <div class="instances-container">
        `;

        // Generate form elements for each instance
        settings.instances.forEach((instance, index) => {
            instancesHtml += `
                <div class="instance-item" data-instance-id="${index}">
                    <div class="instance-header">
                        <h4>Instance ${index + 1}: ${instance.name || 'Unnamed'}</h4>
                        <div class="instance-actions">
                            ${index > 0 ? '<button type="button" class="remove-instance-btn">Remove</button>' : ''}
                            <button type="button" class="test-connection-btn" data-instance="${index}" style="margin-left: 10px;">
                                <i class="fas fa-plug"></i> Test Connection
                            </button>
                        </div>
                    </div>
                    <div class="instance-content">
                        <div class="setting-item">
                            <label for="whisparr-name-${index}"><a href="https://huntarr.io/threads/name-field.18/" class="info-icon" title="Learn more about naming your Whisparr instance" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Name:</label>
                            <input type="text" id="whisparr-name-${index}" name="name" value="${instance.name || ''}" placeholder="Friendly name for this Whisparr V2 instance">
                            <p class="setting-help">Friendly name for this Whisparr V2 instance</p>
                        </div>
                        <div class="setting-item">
                            <label for="whisparr-url-${index}"><a href="https://huntarr.io/threads/url.19/" class="info-icon" title="Learn more about Whisparr URL configuration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>URL:</label>
                            <input type="text" id="whisparr-url-${index}" name="api_url" value="${instance.api_url || ''}" placeholder="Base URL for Whisparr V2 (e.g., http://localhost:6969)">
                            <p class="setting-help">Base URL for Whisparr V2 (e.g., http://localhost:6969)</p>
                        </div>
                        <div class="setting-item">
                            <label for="whisparr-key-${index}"><a href="https://huntarr.io/threads/api-key.20/" class="info-icon" title="Learn more about finding your Whisparr API key" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Key:</label>
                            <input type="text" id="whisparr-key-${index}" name="api_key" value="${instance.api_key || ''}" placeholder="API key for Whisparr V2">
                            <p class="setting-help">API key for Whisparr V2</p>
                        </div>
                        <div class="setting-item">
                            <label for="whisparr-enabled-${index}"><a href="https://huntarr.io/threads/enable-toggle.21/" class="info-icon" title="Learn more about enabling/disabling instances" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Enabled:</label>
                            <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                                <input type="checkbox" id="whisparr-enabled-${index}" name="enabled" ${instance.enabled !== false ? 'checked' : ''}>
                                <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                            </label>
                        </div>
                    </div>
                </div>
            `;
        });

        instancesHtml += `
                </div> <!-- instances-container -->
                <div class="button-container" style="text-align: center; margin-top: 15px;">
                    <button type="button" class="add-instance-btn add-whisparr-instance-btn">
                        <i class="fas fa-plus"></i> Add Whisparr V2 Instance (${settings.instances.length}/9)
                    </button>
                </div>
            </div> <!-- settings-group -->
        `;
        
        // Search Settings
        let searchSettingsHtml = `
            <div class="settings-group">
                <h3>Search Settings</h3>
                <div class="setting-item">
                    <label for="whisparr_hunt_missing_items"><a href="https://huntarr.io" class="info-icon" title="Learn more about missing items search" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Missing Search:</label>
                    <input type="number" id="whisparr_hunt_missing_items" name="hunt_missing_items" min="0" value="${settings.hunt_missing_items !== undefined ? settings.hunt_missing_items : 1}">
                    <p class="setting-help">Number of missing items to search per cycle (0 to disable)</p>
                </div>
                <div class="setting-item">
                    <label for="whisparr_hunt_upgrade_items"><a href="https://huntarr.io" class="info-icon" title="Learn more about upgrading items" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Upgrade Search:</label>
                    <input type="number" id="whisparr_hunt_upgrade_items" name="hunt_upgrade_items" min="0" value="${settings.hunt_upgrade_items !== undefined ? settings.hunt_upgrade_items : 0}">
                    <p class="setting-help">Number of items to search for quality upgrades per cycle (0 to disable)</p>
                </div>
                <div class="setting-item">
                    <label for="whisparr_sleep_duration"><a href="/Huntarr.io/docs/#/configuration?id=sleep-duration" class="info-icon" title="Learn more about sleep duration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Sleep Duration:</label>
                    <input type="number" id="whisparr_sleep_duration" name="sleep_duration" min="60" value="${settings.sleep_duration !== undefined ? settings.sleep_duration : 900}">
                    <p class="setting-help">Time in seconds between processing cycles</p>
                </div>
                <div class="setting-item">
                    <label for="whisparr_hourly_cap"><a href="#" class="info-icon" title="Maximum API requests per hour for this app" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Cap - Hourly:</label>
                    <input type="number" id="whisparr_hourly_cap" name="hourly_cap" min="1" max="500" value="${settings.hourly_cap !== undefined ? settings.hourly_cap : 20}">
                    <p class="setting-help">Maximum API requests per hour (helps prevent rate limiting)</p>
                    <p class="setting-help" style="color: #cc0000; font-weight: bold;">Setting this too high will risk your accounts being banned! You have been warned!</p>
                </div>
            </div>
            
            <div class="settings-group">
                <h3>Additional Options</h3>
                <div class="setting-item">
                    <label for="whisparr_monitored_only"><a href="/Huntarr.io/docs/#/configuration?id=monitored-only" class="info-icon" title="Learn more about monitored only option" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Monitored Only:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="whisparr_monitored_only" name="monitored_only" ${settings.monitored_only !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Only search for monitored items</p>
                </div>
                <div class="setting-item">
                    <label for="whisparr_skip_future_releases"><a href="https://huntarr.io" class="info-icon" title="Learn more about skipping future releases" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Skip Future Releases:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="whisparr_skip_future_releases" name="skip_future_releases" ${settings.skip_future_releases !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Skip searching for scenes with future release dates</p>
                </div>
                <div class="setting-item">
                    <label for="whisparr_tag_processed_items"><a href="https://github.com/plexguide/Huntarr.io/issues/382" class="info-icon" title="Learn more about tagging processed items" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Tag Processed Items:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="whisparr_tag_processed_items" name="tag_processed_items" ${settings.tag_processed_items !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Automatically tag series with "huntarr-processed" after successful searches</p>
                </div>
            </div>
        `;

        // Set the content
        container.innerHTML = instancesHtml + searchSettingsHtml;

        // Add event listeners for the instance management
        this.setupInstanceManagement(container, 'whisparr', settings.instances.length);
        
        // Update duration display
        this.updateDurationDisplay();
    },
    
    // Generate Eros settings form
    generateErosForm: function(container, settings = {}) {
        // Add data-app-type attribute to container
        container.setAttribute('data-app-type', 'eros');
        
        // Make sure the instances array exists
        if (!settings.instances || !Array.isArray(settings.instances) || settings.instances.length === 0) {
            settings.instances = [{
                name: "Default",
                api_url: "",
                api_key: "",
                enabled: true
            }];
        }

        // Create a container for instances
        let instancesHtml = `
            <div class="settings-group">
                <h3>Whisparr V3 Instances</h3>
                <div class="instances-container">
        `;

        // Generate form elements for each instance
        settings.instances.forEach((instance, index) => {
            instancesHtml += `
                <div class="instance-item" data-instance-id="${index}">
                    <div class="instance-header">
                        <h4>Instance ${index + 1}: ${instance.name || 'Unnamed'}</h4>
                        <div class="instance-actions">
                            ${index > 0 ? '<button type="button" class="remove-instance-btn">Remove</button>' : ''}
                            <button type="button" class="test-connection-btn" data-instance="${index}" style="margin-left: 10px;">
                                <i class="fas fa-plug"></i> Test Connection
                            </button>
                        </div>
                    </div>
                    <div class="instance-content">
                        <div class="setting-item">
                            <label for="eros-name-${index}"><a href="https://huntarr.io/threads/name-field.18/" class="info-icon" title="Learn more about naming your Whisparr V3 instance" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Name:</label>
                            <input type="text" id="eros-name-${index}" name="name" value="${instance.name || ''}" placeholder="Friendly name for this Whisparr V3 instance">
                            <p class="setting-help">Friendly name for this Whisparr V3 instance</p>
                        </div>
                        <div class="setting-item">
                            <label for="eros-url-${index}"><a href="https://huntarr.io/threads/url.19/" class="info-icon" title="Learn more about Whisparr V3 URL configuration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>URL:</label>
                            <input type="text" id="eros-url-${index}" name="api_url" value="${instance.api_url || ''}" placeholder="Base URL for Whisparr V3 (e.g., http://localhost:6969)">
                            <p class="setting-help">Base URL for Whisparr V3 (e.g., http://localhost:6969)</p>
                        </div>
                        <div class="setting-item">
                            <label for="eros-key-${index}"><a href="https://huntarr.io/threads/api-key.20/" class="info-icon" title="Learn more about finding your Whisparr V3 API key" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Key:</label>
                            <input type="text" id="eros-key-${index}" name="api_key" value="${instance.api_key || ''}" placeholder="API key for Whisparr V3">
                            <p class="setting-help">API key for Whisparr V3</p>
                        </div>
                        <div class="setting-item">
                            <label for="eros-enabled-${index}"><a href="https://huntarr.io/threads/enable-toggle.21/" class="info-icon" title="Learn more about enabling/disabling instances" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Enabled:</label>
                            <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                                <input type="checkbox" id="eros-enabled-${index}" name="enabled" ${instance.enabled !== false ? 'checked' : ''}>
                                <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                            </label>
                        </div>
                    </div>
                </div>
            `;
        });

        instancesHtml += `
                </div> <!-- instances-container -->
                <div class="button-container" style="text-align: center; margin-top: 15px;">
                    <button type="button" class="add-instance-btn add-eros-instance-btn">
                        <i class="fas fa-plus"></i> Add Whisparr V3 Instance (${settings.instances.length}/9)
                    </button>
                </div>
            </div> <!-- settings-group -->
        `;
        
        // Search Mode dropdown
        let searchSettingsHtml = `
            <div class="settings-group">
                <h3>Search Settings</h3>
                <div class="setting-item">
                    <label for="eros_search_mode"><a href="https://huntarr.io" class="info-icon" title="Learn more about search modes" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Search Mode:</label>
                    <select id="eros_search_mode" name="search_mode">
                        <option value="movie" ${settings.search_mode === 'movie' || !settings.search_mode ? 'selected' : ''}>Movie</option>
                        <option value="scene" ${settings.search_mode === 'scene' ? 'selected' : ''}>Scene</option>
                    </select>
                    <p class="setting-help">How to search for missing and upgradable Whisparr V3 content (Movie-based or Scene-based)</p>
                </div>
                <div class="setting-item">
                    <label for="eros_hunt_missing_items"><a href="https://huntarr.io" class="info-icon" title="Learn more about missing items search" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Missing Search:</label>
                    <input type="number" id="eros_hunt_missing_items" name="hunt_missing_items" min="0" value="${settings.hunt_missing_items !== undefined ? settings.hunt_missing_items : 1}">
                    <p class="setting-help">Number of missing items to search per cycle (0 to disable)</p>
                </div>
                <div class="setting-item">
                    <label for="eros_hunt_upgrade_items"><a href="https://huntarr.io" class="info-icon" title="Learn more about upgrading items" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Upgrade Search:</label>
                    <input type="number" id="eros_hunt_upgrade_items" name="hunt_upgrade_items" min="0" value="${settings.hunt_upgrade_items !== undefined ? settings.hunt_upgrade_items : 0}">
                    <p class="setting-help">Number of items to search for quality upgrades per cycle (0 to disable)</p>
                </div>
                <div class="setting-item">
                    <label for="eros_sleep_duration"><a href="/Huntarr.io/docs/#/configuration?id=sleep-duration" class="info-icon" title="Learn more about sleep duration" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Sleep Duration:</label>
                    <input type="number" id="eros_sleep_duration" name="sleep_duration" min="60" value="${settings.sleep_duration !== undefined ? settings.sleep_duration : 900}">
                    <p class="setting-help">Time in seconds between processing cycles</p>
                </div>
                <div class="setting-item">
                    <label for="eros_hourly_cap"><a href="#" class="info-icon" title="Maximum API requests per hour for this app" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Cap - Hourly:</label>
                    <input type="number" id="eros_hourly_cap" name="hourly_cap" min="1" max="500" value="${settings.hourly_cap !== undefined ? settings.hourly_cap : 20}">
                    <p class="setting-help">Maximum API requests per hour (helps prevent rate limiting)</p>
                    <p class="setting-help" style="color: #cc0000; font-weight: bold;">Setting this too high will risk your accounts being banned! You have been warned!</p>
                </div>
            </div>
            
            <div class="settings-group">
                <h3>Additional Options</h3>
                <div class="setting-item">
                    <label for="eros_monitored_only"><a href="/Huntarr.io/docs/#/configuration?id=monitored-only" class="info-icon" title="Learn more about monitored only option" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Monitored Only:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="eros_monitored_only" name="monitored_only" ${settings.monitored_only !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Only search for monitored items</p>
                </div>
                <div class="setting-item">
                    <label for="eros_skip_future_releases"><a href="https://huntarr.io" class="info-icon" title="Learn more about skipping future releases" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Skip Future Releases:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="eros_skip_future_releases" name="skip_future_releases" ${settings.skip_future_releases !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Skip searching for scenes with future release dates</p>
                </div>
                <div class="setting-item">
                    <label for="eros_tag_processed_items"><a href="https://github.com/plexguide/Huntarr.io/issues/382" class="info-icon" title="Learn more about tagging processed items" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Tag Processed Items:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="eros_tag_processed_items" name="tag_processed_items" ${settings.tag_processed_items !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Automatically tag movies with "huntarr-processed" after successful searches</p>
                </div>
            </div>
        `;

        // Set the content
        container.innerHTML = instancesHtml + searchSettingsHtml;

        // Add event listeners for the instance management
        this.setupInstanceManagement(container, 'eros', settings.instances.length);
        
        // Update duration display
        this.updateDurationDisplay();
    },
    
    // Generate Swaparr settings form
    generateSwaparrForm: function(container, settings = {}) {
        // Add data-app-type attribute to container
        container.setAttribute('data-app-type', 'swaparr');
        
        const html = `
            <div class="settings-group">
                <h3>Swaparr Configuration</h3>
                <p class="setting-help" style="margin-bottom: 20px; color: #9ca3af;">
                    Swaparr monitors your *arr applications' download queues and removes stalled downloads automatically.
                    Based on <a href="https://github.com/ThijmenGThN/swaparr" target="_blank" style="color: #3b82f6;">Swaparr v0.10.0</a>.
                </p>
                
                <div class="setting-item">
                    <label for="swaparr_enabled">
                        <a href="https://plexguide.github.io/Huntarr.io/apps/swaparr.html#enable-swaparr" class="info-icon" title="Enable or disable Swaparr" target="_blank" rel="noopener">
                            <i class="fas fa-info-circle"></i>
                        </a>
                        Enable Swaparr:
                    </label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="swaparr_enabled" ${settings.enabled === true ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Enable automatic removal of stalled downloads</p>
                </div>
                
                <div class="setting-item">
                    <label for="swaparr_max_strikes">
                        <a href="https://plexguide.github.io/Huntarr.io/apps/swaparr.html#max-strikes" class="info-icon" title="Number of strikes before removal" target="_blank" rel="noopener">
                            <i class="fas fa-info-circle"></i>
                        </a>
                        Max Strikes:
                    </label>
                    <input type="number" id="swaparr_max_strikes" min="1" max="10" value="${settings.max_strikes || 3}">
                    <p class="setting-help">Number of strikes a download gets before being removed (default: 3)</p>
                </div>
                
                <div class="setting-item">
                    <label for="swaparr_max_download_time">
                        <a href="https://plexguide.github.io/Huntarr.io/apps/swaparr.html#max-download-time" class="info-icon" title="Maximum time before considering download stalled" target="_blank" rel="noopener">
                            <i class="fas fa-info-circle"></i>
                        </a>
                        Max Download Time:
                    </label>
                    <input type="text" id="swaparr_max_download_time" value="${settings.max_download_time || '2h'}" placeholder="e.g., 2h, 120m, 7200s">
                    <p class="setting-help">Maximum time before considering a download stalled (examples: 2h, 120m, 7200s)</p>
                </div>
                
                <div class="setting-item">
                    <label for="swaparr_ignore_above_size">
                        <a href="https://plexguide.github.io/Huntarr.io/apps/swaparr.html#ignore-above-size" class="info-icon" title="Ignore downloads larger than this size" target="_blank" rel="noopener">
                            <i class="fas fa-info-circle"></i>
                        </a>
                        Ignore Above Size:
                    </label>
                    <input type="text" id="swaparr_ignore_above_size" value="${settings.ignore_above_size || '25GB'}" placeholder="e.g., 25GB, 10GB, 5000MB">
                    <p class="setting-help">Ignore downloads larger than this size (examples: 25GB, 10GB, 5000MB)</p>
                </div>
                
                <div class="setting-item">
                    <label for="swaparr_remove_from_client">
                        <a href="https://plexguide.github.io/Huntarr.io/apps/swaparr.html#remove-from-client" class="info-icon" title="Remove downloads from download client" target="_blank" rel="noopener">
                            <i class="fas fa-info-circle"></i>
                        </a>
                        Remove from Client:
                    </label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="swaparr_remove_from_client" ${settings.remove_from_client !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Also remove downloads from the download client (recommended: enabled)</p>
                </div>
                
                <div class="setting-item">
                    <label for="swaparr_dry_run">
                        <a href="https://plexguide.github.io/Huntarr.io/apps/swaparr.html#dry-run-mode" class="info-icon" title="Test mode - no actual removals" target="_blank" rel="noopener">
                            <i class="fas fa-info-circle"></i>
                        </a>
                        Dry Run Mode:
                    </label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="swaparr_dry_run" ${settings.dry_run === true ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help">Test mode - logs what would be removed without actually removing anything</p>
                </div>
            </div>
            
            <div class="settings-group">
                <h3>Swaparr Status</h3>
                <div id="swaparrStatus" class="status-panel">
                    <div class="loading-panel">
                        <i class="fas fa-spinner fa-spin"></i> Loading status...
                    </div>
                </div>
                <div style="margin-top: 15px;">
                    <button type="button" id="testSwaparrBtn" class="btn btn-secondary" style="background-color: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-right: 10px;">
                        <i class="fas fa-vial"></i> Test Configuration
                    </button>
                    <button type="button" id="runSwaparrBtn" class="btn btn-secondary" style="background-color: #059669; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-right: 10px;">
                        <i class="fas fa-play"></i> Run Now
                    </button>
                    <button type="button" id="resetSwaparrBtn" class="btn btn-secondary" style="background-color: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                        <i class="fas fa-undo"></i> Reset Data
                    </button>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Load status immediately
        this.loadSwaparrStatus(container);
        
        // Set up button event listeners
        const testBtn = container.querySelector('#testSwaparrBtn');
        const runBtn = container.querySelector('#runSwaparrBtn');
        const resetBtn = container.querySelector('#resetSwaparrBtn');
        
        if (testBtn) {
            testBtn.addEventListener('click', () => this.testSwaparrConfig(testBtn));
        }
        
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runSwaparrNow(runBtn));
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSwaparrData(resetBtn));
        }
    },
    
    // Load Swaparr status
    loadSwaparrStatus: function(container) {
        const statusPanel = container.querySelector('#swaparrStatus');
        if (!statusPanel) return;
        
        HuntarrUtils.fetchWithTimeout('./api/swaparr/status')
            .then(response => response.json())
            .then(data => {
                const sessionStats = data.session_statistics || {};
                const appStats = data.app_statistics || {};
                const settings = data.settings || {};
                
                let statusHtml = `
                    <div class="status-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px;">
                        <div class="stat-item">
                            <div class="stat-label">Session Processed</div>
                            <div class="stat-value" style="color: #3b82f6;">${sessionStats.processed || 0}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Session Strikes</div>
                            <div class="stat-value" style="color: #f59e0b;">${sessionStats.strikes || 0}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Session Removals</div>
                            <div class="stat-value" style="color: #ef4444;">${sessionStats.removals || 0}</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-label">Session Ignored</div>
                            <div class="stat-value" style="color: #6b7280;">${sessionStats.ignored || 0}</div>
                        </div>
                    </div>
                `;
                
                if (Object.keys(appStats).length > 0) {
                    statusHtml += `
                        <div class="app-stats" style="margin-top: 15px;">
                            <h4>Per-App Statistics</h4>
                            <div class="app-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px;">
                    `;
                    
                    Object.entries(appStats).forEach(([app, stats]) => {
                        statusHtml += `
                            <div class="app-stat">
                                <div class="app-name" style="font-weight: bold; text-transform: capitalize;">${app}</div>
                                <div class="app-stats-detail" style="font-size: 12px; color: #9ca3af;">
                                    P: ${stats.processed || 0} | S: ${stats.strikes || 0} | R: ${stats.removals || 0}
                                </div>
                            </div>
                        `;
                    });
                    
                    statusHtml += `
                            </div>
                        </div>
                    `;
                }
                
                // Configuration summary
                statusHtml += `
                    <div class="config-summary" style="margin-top: 15px; padding: 10px; background-color: rgba(0,0,0,0.2); border-radius: 6px;">
                        <h4>Current Configuration</h4>
                        <div style="font-size: 13px; color: #d1d5db;">
                            <div>Max Strikes: <span style="color: #3b82f6;">${settings.max_strikes || 3}</span></div>
                            <div>Max Download Time: <span style="color: #3b82f6;">${settings.max_download_time || '2h'}</span></div>
                            <div>Ignore Above Size: <span style="color: #3b82f6;">${settings.ignore_above_size || '25GB'}</span></div>
                            <div>Dry Run: <span style="color: ${settings.dry_run ? '#f59e0b' : '#10b981'};">${settings.dry_run ? 'Enabled' : 'Disabled'}</span></div>
                        </div>
                    </div>
                `;
                
                statusPanel.innerHTML = statusHtml;
            })
            .catch(error => {
                console.error('Error loading Swaparr status:', error);
                statusPanel.innerHTML = `
                    <div class="error-message" style="color: #ef4444; text-align: center;">
                        <i class="fas fa-exclamation-triangle"></i>
                        Failed to load status. Check if any *arr apps are configured.
                    </div>
                `;
            });
    },
    
    // Test Swaparr configuration
    testSwaparrConfig: function(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        button.disabled = true;
        
        HuntarrUtils.fetchWithTimeout('./api/swaparr/test', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                button.innerHTML = originalText;
                button.disabled = false;
                
                if (data.success) {
                    alert(`Test successful!\n\nFound ${data.total_apps || 0} configured apps:\n${(data.configured_apps || []).join(', ') || 'None'}`);
                } else {
                    alert(`Test failed: ${data.message || 'Unknown error'}`);
                }
            })
            .catch(error => {
                button.innerHTML = originalText;
                button.disabled = false;
                alert(`Test failed: ${error.message}`);
            });
    },
    
    // Run Swaparr now
    runSwaparrNow: function(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        button.disabled = true;
        
        HuntarrUtils.fetchWithTimeout('./api/swaparr/run', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                button.innerHTML = originalText;
                button.disabled = false;
                
                if (data.success) {
                    alert('Swaparr processing triggered successfully! Check logs for details.');
                    // Reload status after a short delay
                    setTimeout(() => {
                        const container = button.closest('.settings-group').parentElement;
                        this.loadSwaparrStatus(container);
                    }, 2000);
                } else {
                    alert(`Run failed: ${data.message || 'Unknown error'}`);
                }
            })
            .catch(error => {
                button.innerHTML = originalText;
                button.disabled = false;
                alert(`Run failed: ${error.message}`);
            });
    },
    
    // Reset Swaparr data
    resetSwaparrData: function(button) {
        if (!confirm('Are you sure you want to reset all Swaparr data? This will clear strikes and removed items.')) {
            return;
        }
        
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resetting...';
        button.disabled = true;
        
        HuntarrUtils.fetchWithTimeout('./api/swaparr/reset', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                button.innerHTML = originalText;
                button.disabled = false;
                
                if (data.success) {
                    alert('Swaparr data reset successfully!');
                    // Reload status
                    const container = button.closest('.settings-group').parentElement;
                    this.loadSwaparrStatus(container);
                } else {
                    alert(`Reset failed: ${data.message || 'Unknown error'}`);
                }
            })
            .catch(error => {
                button.innerHTML = originalText;
                button.disabled = false;
                alert(`Reset failed: ${error.message}`);
            });
    },
    
    // Format date nicely for display
    formatDate: function(date) {
        if (!date) return 'Never';
        
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        
        return date.toLocaleString('en-US', options);
    },
    
    // Get settings from form
    getFormSettings: function(container, appType) {
        let settings = {};
        
        // Helper function to get input value with fallback
        function getInputValue(selector, defaultValue) {
            const element = container.querySelector(selector);
            if (!element) return defaultValue;
            
            if (element.type === 'checkbox') {
                return element.checked;
            } else if (element.type === 'number') {
                const parsedValue = parseInt(element.value);
                return !isNaN(parsedValue) ? parsedValue : defaultValue;
            } else {
                return element.value || defaultValue;
            }
        }
        
        // For the general settings form, collect settings including advanced settings
        if (appType === 'general') {
            console.log('Processing general settings');
            console.log('Container:', container);
            console.log('Container HTML (first 500 chars):', container.innerHTML.substring(0, 500));
            
            // Debug: Check if apprise_urls exists anywhere
            const globalAppriseElement = document.querySelector('#apprise_urls');
            console.log('Global apprise_urls element:', globalAppriseElement);
            
            settings.instances = [];
            settings.timezone = getInputValue('#timezone', 'UTC');
            settings.check_for_updates = getInputValue('#check_for_updates', true);
            settings.display_community_resources = getInputValue('#display_community_resources', true);
            settings.low_usage_mode = getInputValue('#low_usage_mode', false);
            settings.stateful_management_hours = getInputValue('#stateful_management_hours', 168);
            
            // Auth mode handling
            const authModeElement = container.querySelector('#auth_mode');
            if (authModeElement) {
                settings.auth_mode = authModeElement.value;
            }
            
            settings.ssl_verify = getInputValue('#ssl_verify', true);
            settings.api_timeout = getInputValue('#api_timeout', 120);
            settings.command_wait_delay = getInputValue('#command_wait_delay', 1);
            settings.command_wait_attempts = getInputValue('#command_wait_attempts', 600);
            settings.minimum_download_queue_size = getInputValue('#minimum_download_queue_size', -1);
            settings.log_refresh_interval_seconds = getInputValue('#log_refresh_interval_seconds', 30);
            settings.base_url = getInputValue('#base_url', '');
            
            // Notification settings
            settings.enable_notifications = getInputValue('#enable_notifications', false);
            settings.notification_level = container.querySelector('#notification_level')?.value || 'info';
            
            // Process apprise URLs (split by newline)
            const appriseUrlsElement = container.querySelector('#apprise_urls');
            console.log('Container apprise_urls element found:', appriseUrlsElement);
            const appriseUrlsText = appriseUrlsElement?.value || '';
            console.log('Apprise URLs raw text:', appriseUrlsText);
            settings.apprise_urls = appriseUrlsText.split('\n')
                .map(url => url.trim())
                .filter(url => url.length > 0);
            console.log('Apprise URLs processed:', settings.apprise_urls);
                
            settings.notify_on_missing = getInputValue('#notify_on_missing', true);
            settings.notify_on_upgrade = getInputValue('#notify_on_upgrade', true);
            settings.notification_include_instance = getInputValue('#notification_include_instance', true);
            settings.notification_include_app = getInputValue('#notification_include_app', true);
            
            // Handle the auth_mode dropdown
            const authMode = container.querySelector('#auth_mode')?.value || 'login';
            
            // Save the auth_mode value directly
            settings.auth_mode = authMode;
            
            // Set the appropriate flags based on the selected auth mode
            switch (authMode) {
                case 'local_bypass':
                    settings.local_access_bypass = true;
                    settings.proxy_auth_bypass = false;
                    break;
                case 'no_login':
                    settings.local_access_bypass = false;
                    settings.proxy_auth_bypass = true;
                    break;
                case 'login':
                default:
                    settings.local_access_bypass = false;
                    settings.proxy_auth_bypass = false;
                    break;
            }
        }
        
        // For other app types, collect settings
        else {
            // Handle instances differently
            const instances = [];
            // Find instance containers with both old and new class names
            const instanceContainers = container.querySelectorAll('.instance-item, .instance-panel');
            
            // Collect instance data with improved error handling
            instanceContainers.forEach((instance, index) => {
                const nameInput = instance.querySelector('input[name="name"]');
                const urlInput = instance.querySelector('input[name="api_url"]');
                const keyInput = instance.querySelector('input[name="api_key"]');
                const enabledInput = instance.querySelector('input[name="enabled"]');
                
                const name = nameInput ? nameInput.value : null;
                const url = urlInput ? urlInput.value : null;
                const key = keyInput ? keyInput.value : null;
                const enabled = enabledInput ? enabledInput.checked : true; // Default to enabled if checkbox not found
                
                if (!name || !url || !key) {
                    console.warn(`Instance ${index} is missing required fields`);
                }
                
                const instanceObj = {
                    name: name || `Instance ${index + 1}`,
                    api_url: url || "",
                    api_key: key || "",
                    enabled: enabled
                };
                
                instances.push(instanceObj);
            });
            
            // Ensure we always have at least one instance
            if (instances.length === 0) {
                console.warn('No instances found, adding a default empty instance');
                instances.push({
                    name: 'Default',
                    api_url: '',
                    api_key: '',
                    enabled: true
                });
            }
            
            settings.instances = instances;
            
            // Add app-specific settings
            if (appType === 'sonarr') {
                settings.hunt_missing_mode = getInputValue('#sonarr-hunt-missing-mode', 'seasons_packs');
                settings.upgrade_mode = getInputValue('#sonarr-upgrade-mode', 'seasons_packs');
                settings.hunt_missing_items = getInputValue('#sonarr-hunt-missing-items', 1);
                settings.hunt_upgrade_items = getInputValue('#sonarr-hunt-upgrade-items', 0);
                settings.sleep_duration = getInputValue('#sonarr_sleep_duration', 900);
                settings.hourly_cap = getInputValue('#sonarr_hourly_cap', 20);
                settings.monitored_only = getInputValue('#sonarr_monitored_only', true);
                settings.skip_future_episodes = getInputValue('#sonarr_skip_future_episodes', true);
                settings.tag_processed_items = getInputValue('#sonarr_tag_processed_items', true);

            } 
            else if (appType === 'radarr') {
                settings.hunt_missing_movies = getInputValue('#radarr_hunt_missing_movies', 1);
                settings.hunt_upgrade_movies = getInputValue('#radarr_hunt_upgrade_movies', 0);
                settings.sleep_duration = getInputValue('#radarr_sleep_duration', 900);
                settings.hourly_cap = getInputValue('#radarr_hourly_cap', 20);
                settings.monitored_only = getInputValue('#radarr_monitored_only', true);
                settings.skip_future_releases = getInputValue('#radarr_skip_future_releases', true);
                settings.tag_processed_items = getInputValue('#radarr_tag_processed_items', true);

                settings.release_type = getInputValue('#radarr_release_type', 'physical');
            } 
            else if (appType === 'lidarr') {
                settings.hunt_missing_items = getInputValue('#lidarr_hunt_missing_items', 1);
                settings.hunt_upgrade_items = getInputValue('#lidarr_hunt_upgrade_items', 0);
                settings.hunt_missing_mode = getInputValue('#lidarr_hunt_missing_mode', 'album');
                settings.monitored_only = getInputValue('#lidarr_monitored_only', true);
                settings.sleep_duration = getInputValue('#lidarr_sleep_duration', 900);
                settings.hourly_cap = getInputValue('#lidarr_hourly_cap', 20);
                settings.tag_processed_items = getInputValue('#lidarr_tag_processed_items', true);
            } 
            else if (appType === 'readarr') {
                settings.hunt_missing_books = getInputValue('#readarr_hunt_missing_books', 1);
                settings.hunt_upgrade_books = getInputValue('#readarr_hunt_upgrade_books', 0);
                settings.monitored_only = getInputValue('#readarr_monitored_only', true);
                settings.skip_future_releases = getInputValue('#readarr_skip_future_releases', true);
                settings.tag_processed_items = getInputValue('#readarr_tag_processed_items', true);

                settings.sleep_duration = getInputValue('#readarr_sleep_duration', 900);
                settings.hourly_cap = getInputValue('#readarr_hourly_cap', 20);
            } 
            else if (appType === 'whisparr') {
                settings.hunt_missing_items = getInputValue('#whisparr_hunt_missing_items', 1);
                settings.hunt_upgrade_items = getInputValue('#whisparr_hunt_upgrade_items', 0);
                settings.monitored_only = getInputValue('#whisparr_monitored_only', true);
                settings.whisparr_version = getInputValue('#whisparr-api-version', 'v3');
                settings.skip_future_releases = getInputValue('#whisparr_skip_future_releases', true);
                settings.tag_processed_items = getInputValue('#whisparr_tag_processed_items', true);

                settings.sleep_duration = getInputValue('#whisparr_sleep_duration', 900);
                settings.hourly_cap = getInputValue('#whisparr_hourly_cap', 20);
            }
            else if (appType === 'eros') {
                settings.search_mode = getInputValue('#eros_search_mode', 'movie');
                settings.hunt_missing_items = getInputValue('#eros_hunt_missing_items', 1);
                settings.hunt_upgrade_items = getInputValue('#eros_hunt_upgrade_items', 0);
                settings.monitored_only = getInputValue('#eros_monitored_only', true);
                settings.skip_future_releases = getInputValue('#eros_skip_future_releases', true);
                settings.tag_processed_items = getInputValue('#eros_tag_processed_items', true);

                settings.sleep_duration = getInputValue('#eros_sleep_duration', 900);
                settings.hourly_cap = getInputValue('#eros_hourly_cap', 20);
            }
            else if (appType === 'swaparr') {
                // Swaparr doesn't use instances, so set empty array
                settings.instances = [];
                
                settings.enabled = getInputValue('#swaparr_enabled', false);
                settings.max_strikes = getInputValue('#swaparr_max_strikes', 3);
                settings.max_download_time = getInputValue('#swaparr_max_download_time', '2h');
                settings.ignore_above_size = getInputValue('#swaparr_ignore_above_size', '25GB');
                settings.remove_from_client = getInputValue('#swaparr_remove_from_client', true);
                settings.dry_run = getInputValue('#swaparr_dry_run', false);
            }
        }
        
        console.log('Collected settings for', appType, settings);
        return settings;
    },
    
    // Generate General settings form
    generateGeneralForm: function(container, settings = {}) {
        // Add data-app-type attribute to container
        container.setAttribute('data-app-type', 'general');
        
        container.innerHTML = `
            <div class="settings-group">
                <h3>System Settings</h3>
                <div class="setting-item">
                    <label for="check_for_updates"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#check-for-updates" class="info-icon" title="Learn more about update checking" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Check for Updates:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="check_for_updates" ${settings.check_for_updates !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help" style="margin-left: -3ch !important;">Automatically check for Huntarr updates</p>
                </div>
                <div class="setting-item">
                    <label for="display_community_resources"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#display-resources" class="info-icon" title="Learn more about resources display options" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Display Resources:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="display_community_resources" ${settings.display_community_resources !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help" style="margin-left: -3ch !important;">Show or hide the Resources section on the home page</p>
                </div>
                <div class="setting-item">
                    <label for="low_usage_mode"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#low-usage-mode" class="info-icon" title="Learn more about Low Usage Mode" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Low Usage Mode:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="low_usage_mode" ${settings.low_usage_mode === true ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help" style="margin-left: -3ch !important;">Disables animations to reduce CPU/GPU usage on older devices</p>
                </div>
                <div class="setting-item">
                    <label for="timezone"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#timezone" class="info-icon" title="Set your timezone for accurate time display" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Timezone:</label>
                    <select id="timezone" name="timezone" style="width: 300px; padding: 8px 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.1); background-color: #1f2937; color: #d1d5db;">
                        <option value="UTC" ${settings.timezone === 'UTC' || !settings.timezone ? 'selected' : ''}>UTC (Coordinated Universal Time)</option>
                        <option value="America/New_York" ${settings.timezone === 'America/New_York' ? 'selected' : ''}>Eastern Time (America/New_York)</option>
                        <option value="America/Chicago" ${settings.timezone === 'America/Chicago' ? 'selected' : ''}>Central Time (America/Chicago)</option>
                        <option value="America/Denver" ${settings.timezone === 'America/Denver' ? 'selected' : ''}>Mountain Time (America/Denver)</option>
                        <option value="America/Los_Angeles" ${settings.timezone === 'America/Los_Angeles' ? 'selected' : ''}>Pacific Time (America/Los_Angeles)</option>
                        <option value="Pacific/Honolulu" ${settings.timezone === 'Pacific/Honolulu' ? 'selected' : ''}>Hawaii Time (Pacific/Honolulu)</option>
                        <option value="America/Toronto" ${settings.timezone === 'America/Toronto' ? 'selected' : ''}>Eastern Canada (America/Toronto)</option>
                        <option value="America/Vancouver" ${settings.timezone === 'America/Vancouver' ? 'selected' : ''}>Pacific Canada (America/Vancouver)</option>
                        <option value="Europe/London" ${settings.timezone === 'Europe/London' ? 'selected' : ''}>UK Time (Europe/London)</option>
                        <option value="Europe/Paris" ${settings.timezone === 'Europe/Paris' ? 'selected' : ''}>Central Europe (Europe/Paris)</option>
                        <option value="Europe/Berlin" ${settings.timezone === 'Europe/Berlin' ? 'selected' : ''}>Germany (Europe/Berlin)</option>
                        <option value="Europe/Amsterdam" ${settings.timezone === 'Europe/Amsterdam' ? 'selected' : ''}>Netherlands (Europe/Amsterdam)</option>
                        <option value="Europe/Rome" ${settings.timezone === 'Europe/Rome' ? 'selected' : ''}>Italy (Europe/Rome)</option>
                        <option value="Europe/Madrid" ${settings.timezone === 'Europe/Madrid' ? 'selected' : ''}>Spain (Europe/Madrid)</option>
                        <option value="Asia/Tokyo" ${settings.timezone === 'Asia/Tokyo' ? 'selected' : ''}>Japan (Asia/Tokyo)</option>
                        <option value="Asia/Shanghai" ${settings.timezone === 'Asia/Shanghai' ? 'selected' : ''}>China (Asia/Shanghai)</option>
                        <option value="Asia/Kolkata" ${settings.timezone === 'Asia/Kolkata' ? 'selected' : ''}>India (Asia/Kolkata)</option>
                        <option value="Australia/Sydney" ${settings.timezone === 'Australia/Sydney' ? 'selected' : ''}>Australia East (Australia/Sydney)</option>
                        <option value="Australia/Perth" ${settings.timezone === 'Australia/Perth' ? 'selected' : ''}>Australia West (Australia/Perth)</option>
                        <option value="Pacific/Auckland" ${settings.timezone === 'Pacific/Auckland' ? 'selected' : ''}>New Zealand (Pacific/Auckland)</option>
                    </select>
                    <p class="setting-help" style="margin-left: -3ch !important;">Set your timezone for accurate time display in logs and scheduling. Changes are applied when you save settings.</p>
                </div>
            </div>
            
            <div class="settings-group">
                <div class="stateful-header-row">
                    <h3>Stateful Management</h3>
                    <!-- Original reset button removed, now using emergency button -->
                </div>
                <div id="stateful-section" class="setting-info-block">
                    <div id="stateful-notification" class="notification error" style="display: none;">
                        Failed to load stateful management info. Check logs for details.
                    </div>
                    <div class="info-container">
                        <div class="date-info-block">
                            <div class="date-label">Initial State Created:</div>
                            <div id="stateful_initial_state" class="date-value">Loading...</div>
                        </div>
                        <div class="date-info-block">
                            <div class="date-label">State Reset Date:</div>
                            <div id="stateful_expires_date" class="date-value">Loading...</div>
                        </div>
                    </div>
                </div>
                <div class="setting-item">
                    <label for="stateful_management_hours"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#state-reset-hours" class="info-icon" title="Learn more about state reset intervals" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>State Reset (Hours):</label>
                    <input type="number" id="stateful_management_hours" min="1" value="${settings.stateful_management_hours || 168}" style="width: 50% !important; max-width: 200px !important; box-sizing: border-box !important; margin: 0 !important; padding: 8px 12px !important; border-radius: 4px !important; display: block !important; text-align: left !important;">
                    <p class="setting-help" style="margin-left: -3ch !important;">Hours before resetting processed media state (<span id="stateful_management_days">${((settings.stateful_management_hours || 168) / 24).toFixed(1)} days</span>)</p>
                    <p class="setting-help reset-help" style="margin-left: -3ch !important;">Reset clears all processed media IDs to allow reprocessing</p>
                </div>
            </div>
            
            <div class="settings-group">
                <h3>Security</h3>
                <div class="setting-item">
                    <label for="auth_mode"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#authentication-mode" class="info-icon" title="Learn more about authentication modes" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Authentication Mode:</label>
                    <select id="auth_mode" name="auth_mode" style="width: 300px; padding: 8px 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.1); background-color: #1f2937; color: #d1d5db;">
                        <option value="login" ${(settings.auth_mode === 'login' || (!settings.auth_mode && !settings.local_access_bypass && !settings.proxy_auth_bypass)) ? 'selected' : ''}>Login Mode</option>
                        <option value="local_bypass" ${(settings.auth_mode === 'local_bypass' || (!settings.auth_mode && settings.local_access_bypass === true && !settings.proxy_auth_bypass)) ? 'selected' : ''}>Local Bypass Mode</option>
                        <option value="no_login" ${(settings.auth_mode === 'no_login' || (!settings.auth_mode && settings.proxy_auth_bypass === true)) ? 'selected' : ''}>No Login Mode</option>
                    </select>
                    <p class="setting-help" style="margin-left: -3ch !important;">
                        <strong>Login Mode:</strong> Standard login required for all connections<br>
                        <strong>Local Bypass Mode:</strong> Only local network connections (192.168.x.x, 10.x.x.x) bypass login<br>
                        <strong>No Login Mode:</strong> Completely disable authentication
                    </p>
                    <p class="setting-help warning" style="color: #ff6b6b; margin-left: -3ch !important;"><strong>Warning:</strong> Only use No Login Mode if your reverse proxy (e.g., Cloudflare, Nginx) is properly securing access!</p>
                </div>
                <div class="setting-item">
                    <label for="ssl_verify"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#enable-ssl-verify" class="info-icon" title="Learn more about SSL verification" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Enable SSL Verify:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="ssl_verify" ${settings.ssl_verify === true ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help" style="margin-left: -3ch !important;">Disable SSL certificate verification when using self-signed certificates in private networks.</p>
                </div>
            </div>
            
            <div class="settings-group">
                <h3>Advanced Settings</h3>
                <div class="setting-item">
                    <label for="api_timeout"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#api-timeout" class="info-icon" title="Learn more about API timeout settings" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>API Timeout:</label>
                    <input type="number" id="api_timeout" min="10" value="${settings.api_timeout !== undefined ? settings.api_timeout : 120}">
                    <p class="setting-help" style="margin-left: -3ch !important;">API request timeout in seconds</p>
                </div>
                <div class="setting-item">
                    <label for="command_wait_delay"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#command-wait-delay" class="info-icon" title="Learn more about command wait settings" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Command Wait Delay:</label>
                    <input type="number" id="command_wait_delay" min="1" value="${settings.command_wait_delay !== undefined ? settings.command_wait_delay : 1}">
                    <p class="setting-help" style="margin-left: -3ch !important;">Delay between command status checks in seconds</p>
                </div>
                <div class="setting-item">
                    <label for="command_wait_attempts"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#cmd-wait-attempts" class="info-icon" title="Learn more about command wait settings" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>CMD Wait Attempts:</label>
                    <input type="number" id="command_wait_attempts" min="1" value="${settings.command_wait_attempts !== undefined ? settings.command_wait_attempts : 600}">
                    <p class="setting-help" style="margin-left: -3ch !important;">Maximum number of attempts to check command status</p>
                </div>
                <div class="setting-item">
                    <label for="minimum_download_queue_size"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#max-dl-queue-size" class="info-icon" title="Learn more about download queue management" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Max DL Queue Size:</label>
                    <input type="number" id="minimum_download_queue_size" min="-1" value="${settings.minimum_download_queue_size !== undefined ? settings.minimum_download_queue_size : -1}">
                    <p class="setting-help" style="margin-left: -3ch !important;">If the current download queue for an app instance exceeds this value, downloads will be skipped until the queue reduces. Set to -1 to disable this limit.</span>
                </div>
                <div class="setting-item">
                    <label for="log_refresh_interval_seconds"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#log-refresh-interval" class="info-icon" title="Learn more about log settings" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Log Refresh Interval:</label>
                    <input type="number" id="log_refresh_interval_seconds" min="5" value="${settings.log_refresh_interval_seconds !== undefined ? settings.log_refresh_interval_seconds : 30}">
                    <p class="setting-help" style="margin-left: -3ch !important;">How often Huntarr refreshes logs from apps (seconds)</p>
                </div>
                <div class="setting-item">
                    <label for="base_url"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#base-url" class="info-icon" title="Learn more about reverse proxy base URL settings" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Base URL:</label>
                    <input type="text" id="base_url" value="${settings.base_url || ''}" placeholder="/huntarr">
                    <p class="setting-help" style="margin-left: -3ch !important;">Base URL path for reverse proxy (e.g., '/huntarr'). Leave empty for root path. Requires restart. Credit <a href="https://github.com/scr4tchy" target="_blank">scr4tchy</a>.</p>
                </div>
                <div class="setting-item">
            </div>

            <div class="settings-group">
                <h3>Apprise Notifications</h3>
                <div class="setting-item">
                    <label for="enable_notifications"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#enable-notifications" class="info-icon" title="Enable or disable notifications" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Enable Notifications:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="enable_notifications" ${settings.enable_notifications === true ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help" style="margin-left: -3ch !important;">Enable sending notifications via Apprise for media processing events</p>
                </div>
                <div class="setting-item">
                    <label for="notification_level"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#notification-level" class="info-icon" title="Set minimum notification level" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Notification Level:</label>
                    <select id="notification_level" name="notification_level" style="width: 200px; padding: 8px 12px; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.1); background-color: #1f2937; color: #d1d5db;">
                        <option value="info" ${settings.notification_level === 'info' || !settings.notification_level ? 'selected' : ''}>Info</option>
                        <option value="success" ${settings.notification_level === 'success' ? 'selected' : ''}>Success</option>
                        <option value="warning" ${settings.notification_level === 'warning' ? 'selected' : ''}>Warning</option>
                        <option value="error" ${settings.notification_level === 'error' ? 'selected' : ''}>Error</option>
                    </select>
                    <p class="setting-help" style="margin-left: -3ch !important;">Minimum level of events that will trigger notifications</p>
                </div>
                <div class="setting-item">
                    <label for="apprise_urls"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#apprise-urls" class="info-icon" title="Learn about Apprise URL formats" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Apprise URLs:</label>
                    <textarea id="apprise_urls" rows="4" style="width: 100%; padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); background-color: #1f2937; color: #d1d5db;">${(settings.apprise_urls || []).join('\n')}</textarea>
                    <p class="setting-help" style="margin-left: -3ch !important;">Enter one Apprise URL per line (e.g., discord://, telegram://, etc)</p>
                    <p class="setting-help"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#apprise-urls" target="_blank">Click here for detailed Apprise URL documentation</a></p>
                    <div style="margin-top: 10px;">
                        <button type="button" id="testNotificationBtn" class="btn btn-secondary" style="background-color: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 14px;">
                            <i class="fas fa-bell"></i> Test Notification
                        </button>
                        <span id="testNotificationStatus" style="margin-left: 10px; font-size: 14px;"></span>
                    </div>
                    <p class="setting-help" style="margin-left: -3ch !important; margin-top: 8px; font-style: italic; color: #9ca3af;">
                        <i class="fas fa-magic" style="margin-right: 4px;"></i>Testing will automatically save your current settings first
                    </p>
                </div>
                <div class="setting-item">
                    <label for="notify_on_missing"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#notify-on-missing" class="info-icon" title="Send notifications for missing media" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Notify on Missing:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="notify_on_missing" ${settings.notify_on_missing !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help" style="margin-left: -3ch !important;">Send notifications when missing media is processed</p>
                </div>
                <div class="setting-item">
                    <label for="notify_on_upgrade"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#notify-on-upgrade" class="info-icon" title="Learn more about upgrade notifications" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Notify on Upgrade:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="notify_on_upgrade" ${settings.notify_on_upgrade !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help" style="margin-left: -3ch !important;">Send notifications when media is upgraded</p>
                </div>
                <div class="setting-item">
                    <label for="notification_include_instance"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#include-instance" class="info-icon" title="Include instance name in notifications" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Include Instance:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="notification_include_instance" ${settings.notification_include_instance !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help" style="margin-left: -3ch !important;">Include instance name in notification messages</p>
                </div>
                <div class="setting-item">
                    <label for="notification_include_app"><a href="https://plexguide.github.io/Huntarr.io/settings/settings.html#include-app-name" class="info-icon" title="Include app name in notifications" target="_blank" rel="noopener"><i class="fas fa-info-circle"></i></a>Include App Name:</label>
                    <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                        <input type="checkbox" id="notification_include_app" ${settings.notification_include_app !== false ? 'checked' : ''}>
                        <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                    </label>
                    <p class="setting-help" style="margin-left: -3ch !important;">Include app name (Sonarr, Radarr, etc.) in notification messages</p>
                </div>
            </div>
        `;
        
        // Get hours input and days span elements once
        const statefulHoursInput = container.querySelector('#stateful_management_hours');
        const statefulDaysSpan = container.querySelector('#stateful_management_days');
        
        if (statefulHoursInput && statefulDaysSpan) {
            statefulHoursInput.addEventListener('input', function() {
                const hours = parseInt(this.value);
                const days = (hours / 24).toFixed(1);
                statefulDaysSpan.textContent = `${days} days`;
            });
        }
        
        // Set up Apprise notifications toggle functionality
        const enableNotificationsCheckbox = container.querySelector('#enable_notifications');
        if (enableNotificationsCheckbox) {
            // Function to toggle notification settings visibility
            const toggleNotificationSettings = function(enabled) {
                const settingsToToggle = [
                    'notification_level',
                    'apprise_urls', 
                    'testNotificationBtn',
                    'notify_on_missing',
                    'notify_on_upgrade',
                    'notification_include_instance',
                    'notification_include_app'
                ];
                
                // Find parent setting-item containers for each setting
                settingsToToggle.forEach(settingId => {
                    const element = container.querySelector(`#${settingId}`);
                    if (element) {
                        // Find the parent setting-item div
                        const settingItem = element.closest('.setting-item');
                        if (settingItem) {
                            if (enabled) {
                                settingItem.style.opacity = '1';
                                settingItem.style.pointerEvents = '';
                                // Re-enable form elements
                                const inputs = settingItem.querySelectorAll('input, select, textarea, button');
                                inputs.forEach(input => {
                                    input.disabled = false;
                                    input.style.cursor = '';
                                });
                            } else {
                                settingItem.style.opacity = '0.4';
                                settingItem.style.pointerEvents = 'none';
                                // Disable form elements
                                const inputs = settingItem.querySelectorAll('input, select, textarea, button');
                                inputs.forEach(input => {
                                    input.disabled = true;
                                    input.style.cursor = 'not-allowed';
                                });
                            }
                        }
                    }
                });
                
                // Special handling for test notification button and its container
                const testBtn = container.querySelector('#testNotificationBtn');
                if (testBtn) {
                    testBtn.disabled = !enabled;
                    testBtn.style.opacity = enabled ? '1' : '0.4';
                    testBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
                    
                    // Also handle the button container div
                    const buttonContainer = testBtn.closest('div');
                    if (buttonContainer) {
                        buttonContainer.style.opacity = enabled ? '1' : '0.4';
                        buttonContainer.style.pointerEvents = enabled ? '' : 'none';
                    }
                }
            };
            
            // Set initial state
            toggleNotificationSettings(enableNotificationsCheckbox.checked);
            
            // Add change event listener
            enableNotificationsCheckbox.addEventListener('change', function() {
                toggleNotificationSettings(this.checked);
            });
        }
        
        // Update duration display - e.g., convert seconds to hours
        SettingsForms.updateDurationDisplay();
        
        // Set up timezone preview functionality
        const timezoneSelect = container.querySelector('#timezone');
        if (timezoneSelect) {
            // Update preview on change
            timezoneSelect.addEventListener('change', function() {
                // Removed updateTimezonePreview function call
            });
            
            // Initialize with current timezone
            // Removed updateTimezonePreview function call
        }
    },
    
    // Update duration display - e.g., convert seconds to hours
    updateDurationDisplay: function() {
        // Function to update a specific sleep duration display
        const updateSleepDisplay = function(inputId, spanId) {
            const input = document.getElementById(inputId);
            const span = document.getElementById(spanId);
            if (!input || !span) return;
            
            const seconds = parseInt(input.value);
            if (isNaN(seconds)) return;
            
            const hours = (seconds / 3600).toFixed(1);
            if (hours < 1) {
                const minutes = Math.round(seconds / 60);
                span.textContent = `${minutes} minutes`;
            } else {
                span.textContent = `${hours} hours`;
            }
        };

        // Update for each app
        updateSleepDisplay('sleep_duration', 'sleep_duration_hours');
        updateSleepDisplay('radarr_sleep_duration', 'radarr_sleep_duration_hours');
        updateSleepDisplay('lidarr_sleep_duration', 'lidarr_sleep_duration_hours');
        updateSleepDisplay('readarr_sleep_duration', 'readarr_sleep_duration_hours');
        updateSleepDisplay('whisparr_sleep_duration', 'whisparr_sleep_duration_hours'); // Added Whisparr
    },
    
    // Setup instance management - test connection buttons and add/remove instance buttons
    setupInstanceManagement: function(container, appType, initialCount) {
        console.log(`Setting up instance management for ${appType} with ${initialCount} instances`);
        
        // Make sure container has the app type set
        const form = container.closest('.settings-form');
        if (form && !form.hasAttribute('data-app-type')) {
            form.setAttribute('data-app-type', appType);
        }
        
        // Add listeners for test connection buttons
        const testButtons = container.querySelectorAll('.test-connection-btn');
        testButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Prevent any default form submission
                e.preventDefault();
                
                console.log('Test connection button clicked');
                
                // Get the instance panel containing this button - look for both old and new class names
                const instancePanel = button.closest('.instance-item') || button.closest('.instance-panel');
                if (!instancePanel) {
                    console.error('Could not find instance panel for test button', button);
                    alert('Error: Could not find instance panel');
                    return;
                }
                
                // Get the URL and API key inputs directly within this instance panel
                const urlInput = instancePanel.querySelector('input[name="api_url"]');
                const keyInput = instancePanel.querySelector('input[name="api_key"]');
                
                console.log('Found inputs:', urlInput, keyInput);
                
                if (!urlInput || !keyInput) {
                    console.error('Could not find URL or API key inputs in panel', instancePanel);
                    alert('Error: Could not find URL or API key inputs');
                    return;
                }
                
                const url = urlInput.value.trim();
                const apiKey = keyInput.value.trim();
                
                console.log(`Testing connection for ${appType} - URL: ${url}, API Key: ${apiKey.substring(0, 5)}...`);
                
                if (!url) {
                    alert('Please enter a valid URL');
                    urlInput.focus();
                    return;
                }
                
                if (!apiKey) {
                    alert('Please enter a valid API key');
                    keyInput.focus();
                    return;
                }
                
                // Temporarily suppress change detection to prevent the unsaved changes dialog
                window._suppressUnsavedChangesDialog = true;
                
                // Show testing status
                const originalButtonHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
                button.disabled = true;
                
                // Make the API request
                HuntarrUtils.fetchWithTimeout(`/api/${appType}/test-connection`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        api_url: url,
                        api_key: apiKey
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(`Test connection response:`, data);
                    
                    // Reset button
                    button.disabled = false;
                    
                    if (data.success) {
                        // Success
                        button.innerHTML = '<i class="fas fa-check"></i> Connected!';
                        button.classList.add('test-success');
                        
                        let successMessage = `Successfully connected to ${appType.charAt(0).toUpperCase() + appType.slice(1)}`;
                        if (data.version) {
                            successMessage += ` (version ${data.version})`;
                        }
                        
                        // Alert the user of success
                        alert(successMessage);
                        
                        // Reset button after delay
                        setTimeout(() => {
                            button.innerHTML = originalButtonHTML;
                            button.classList.remove('test-success');
                            // Reset suppression flag
                            window._suppressUnsavedChangesDialog = false;
                        }, 3000);
                    } else {
                        // Failure
                        button.innerHTML = '<i class="fas fa-times"></i> Failed';
                        button.classList.add('test-failed');
                        
                        alert(`Connection failed: ${data.message || 'Unknown error'}`);
                        
                        setTimeout(() => {
                            button.innerHTML = originalButtonHTML;
                            button.classList.remove('test-failed');
                            // Reset suppression flag
                            window._suppressUnsavedChangesDialog = false;
                        }, 3000);
                    }
                })
                .catch(error => {
                    console.error(`Test connection error:`, error);
                    
                    button.disabled = false;
                    button.innerHTML = '<i class="fas fa-times"></i> Error';
                    button.classList.add('test-failed');
                    
                    alert(`Connection test failed: ${error.message}`);
                    
                    setTimeout(() => {
                        button.innerHTML = originalButtonHTML;
                        button.classList.remove('test-failed');
                        // Reset suppression flag
                        window._suppressUnsavedChangesDialog = false;
                    }, 3000);
                });
            });
        });
        
        // Set up remove buttons for existing instances
        const removeButtons = container.querySelectorAll('.remove-instance-btn');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const instancePanel = btn.closest('.instance-item') || btn.closest('.instance-panel');
                if (instancePanel && instancePanel.parentNode) {
                    instancePanel.parentNode.removeChild(instancePanel);
                    
                    // Update the button text with new count if updateAddButtonText exists
                    const addBtn = container.querySelector(`.add-${appType}-instance-btn`);
                    if (addBtn) {
                        const instancesContainer = container.querySelector('.instances-container');
                        if (instancesContainer) {
                            const currentCount = instancesContainer.querySelectorAll('.instance-item').length;
                            addBtn.innerHTML = `<i class="fas fa-plus"></i> Add ${appType.charAt(0).toUpperCase() + appType.slice(1)} Instance (${currentCount}/9)`;
                            
                            // Re-enable button if we're under the limit
                            if (currentCount < 9) {
                                addBtn.disabled = false;
                                addBtn.title = "";
                            }
                        }
                    }
                    
                    // Trigger change event to update save button state
                    const changeEvent = new Event('change');
                    container.dispatchEvent(changeEvent);
                }
            });
        });
        
        // Add instance button functionality
        const addBtn = container.querySelector(`.add-${appType}-instance-btn`);
        if (addBtn) {
            // Function to update the button text with current instance count
            const updateAddButtonText = () => {
                const instancesContainer = container.querySelector('.instances-container');
                if (!instancesContainer) return;
                const currentCount = instancesContainer.querySelectorAll('.instance-item').length;
                addBtn.innerHTML = `<i class="fas fa-plus"></i> Add ${appType.charAt(0).toUpperCase() + appType.slice(1)} Instance (${currentCount}/9)`;
                
                // Disable button if we've reached the limit
                if (currentCount >= 9) {
                    addBtn.disabled = true;
                    addBtn.title = "Maximum of 9 instances allowed";
                } else {
                    addBtn.disabled = false;
                    addBtn.title = "";
                }
            };
            
            // Initial button text update
            updateAddButtonText();
            
            // Add event listener for the add button
            addBtn.addEventListener('click', function() {
                const instancesContainer = container.querySelector('.instances-container');
                if (!instancesContainer) return;
                
                const existingInstances = instancesContainer.querySelectorAll('.instance-item');
                const currentCount = existingInstances.length;
                
                // Don't allow more than 9 instances
                if (currentCount >= 9) {
                    alert('Maximum of 9 instances allowed');
                    return;
                }
                
                const newIndex = currentCount; // Use current count as new index
                
                // Create new instance HTML
                const newInstanceHtml = `
                    <div class="instance-item" data-instance-id="${newIndex}">
                        <div class="instance-header">
                            <h4>Instance ${newIndex + 1}: New Instance</h4>
                            <div class="instance-actions">
                                <button type="button" class="remove-instance-btn">Remove</button>
                                <button type="button" class="test-connection-btn" data-instance="${newIndex}" style="margin-left: 10px;">
                                    <i class="fas fa-plug"></i> Test Connection
                                </button>
                            </div>
                        </div>
                        <div class="instance-content">
                            <div class="setting-item">
                                <label for="${appType}-name-${newIndex}">Name:</label>
                                <input type="text" id="${appType}-name-${newIndex}" name="name" value="" placeholder="Friendly name for this ${appType} instance">
                                <p class="setting-help">Friendly name for this ${appType} instance</p>
                            </div>
                            <div class="setting-item">
                                <label for="${appType}-url-${newIndex}">URL:</label>
                                <input type="text" id="${appType}-url-${newIndex}" name="api_url" value="" placeholder="Base URL for ${appType} (e.g., http://localhost:8989)">
                                <p class="setting-help">Base URL for ${appType}</p>
                            </div>
                            <div class="setting-item">
                                <label for="${appType}-key-${newIndex}">API Key:</label>
                                <input type="text" id="${appType}-key-${newIndex}" name="api_key" value="" placeholder="API key for ${appType}">
                                <p class="setting-help">API key for ${appType}</p>
                            </div>
                            <div class="setting-item">
                                <label for="${appType}-enabled-${newIndex}">Enabled:</label>
                                <label class="toggle-switch" style="width:40px; height:20px; display:inline-block; position:relative;">
                                    <input type="checkbox" id="${appType}-enabled-${newIndex}" name="enabled" checked>
                                    <span class="toggle-slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#3d4353; border-radius:20px; transition:0.4s;"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add the new instance to the container
                instancesContainer.insertAdjacentHTML('beforeend', newInstanceHtml);
                
                // Get the newly added instance element
                const newInstance = instancesContainer.querySelector(`[data-instance-id="${newIndex}"]`);
                
                // Set up event listeners for the new instance's buttons
                const newTestBtn = newInstance.querySelector('.test-connection-btn');
                const newRemoveBtn = newInstance.querySelector('.remove-instance-btn');
                
                // Test connection button
                if (newTestBtn) {
                    newTestBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const instancePanel = newTestBtn.closest('.instance-item');
                        const urlInput = instancePanel.querySelector('input[name="api_url"]');
                        const keyInput = instancePanel.querySelector('input[name="api_key"]');
                        
                        if (!urlInput || !keyInput) {
                            alert('Error: Could not find URL or API key inputs');
                            return;
                        }
                        
                        const url = urlInput.value.trim();
                        const apiKey = keyInput.value.trim();
                        
                        if (!url) {
                            alert('Please enter a valid URL');
                            urlInput.focus();
                            return;
                        }
                        
                        if (!apiKey) {
                            alert('Please enter a valid API key');
                            keyInput.focus();
                            return;
                        }
                        
                        // Use the same test connection logic as existing buttons
                        const originalButtonHTML = newTestBtn.innerHTML;
                        newTestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
                        newTestBtn.disabled = true;
                        
                        HuntarrUtils.fetchWithTimeout(`/api/${appType}/test-connection`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ api_url: url, api_key: apiKey })
                        })
                        .then(response => response.json())
                        .then(data => {
                            newTestBtn.disabled = false;
                            if (data.success) {
                                newTestBtn.innerHTML = '<i class="fas fa-check"></i> Connected!';
                                alert(`Successfully connected to ${appType}`);
                                setTimeout(() => {
                                    newTestBtn.innerHTML = originalButtonHTML;
                                }, 3000);
                            } else {
                                newTestBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
                                alert(`Connection failed: ${data.message || 'Unknown error'}`);
                                setTimeout(() => {
                                    newTestBtn.innerHTML = originalButtonHTML;
                                }, 3000);
                            }
                        })
                        .catch(error => {
                            newTestBtn.disabled = false;
                            newTestBtn.innerHTML = '<i class="fas fa-times"></i> Error';
                            alert(`Connection test failed: ${error.message}`);
                            setTimeout(() => {
                                newTestBtn.innerHTML = originalButtonHTML;
                            }, 3000);
                        });
                    });
                }
                
                // Remove button
                if (newRemoveBtn) {
                    newRemoveBtn.addEventListener('click', function() {
                        newInstance.remove();
                        updateAddButtonText();
                        
                        // Trigger change event
                        const changeEvent = new Event('change');
                        container.dispatchEvent(changeEvent);
                    });
                }
                
                // Update button text and trigger change event
                updateAddButtonText();
                const changeEvent = new Event('change');
                container.dispatchEvent(changeEvent);
                
                // Focus on the name input of the new instance
                const nameInput = newInstance.querySelector('input[name="name"]');
                if (nameInput) {
                    nameInput.focus();
                }
            });
        }
    },
    
    // Test connection to an *arr API
    testConnection: function(app, url, apiKey, buttonElement) {
        // Temporarily suppress change detection to prevent the unsaved changes dialog
        if (window.huntarrUI) {
            window.huntarrUI.suppressUnsavedChangesCheck = true;
        }
        
        // Also set a global flag used by the apps module
        window._suppressUnsavedChangesDialog = true;
        
        // Find or create a status message element next to the button
        let statusElement = buttonElement.closest('.instance-actions').querySelector('.connection-message');
        if (!statusElement) {
            statusElement = document.createElement('span');
            statusElement.className = 'connection-message';
            statusElement.style.marginLeft = '10px';
            statusElement.style.fontWeight = 'bold';
            buttonElement.closest('.instance-actions').insertBefore(statusElement, buttonElement);
        }
        
        // Show testing status
        const originalButtonHTML = buttonElement.innerHTML;
        buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        buttonElement.disabled = true;
        statusElement.textContent = 'Testing connection...';
        statusElement.style.color = '#888';
        
        console.log(`Testing connection for ${app} - URL: ${url}, API Key: ${apiKey.substring(0, 5)}...`);
        
        if (!url) {
            statusElement.textContent = 'Please enter a valid URL';
            statusElement.style.color = 'red';
            buttonElement.innerHTML = originalButtonHTML;
            buttonElement.disabled = false;
            // Reset suppression flags
            this._resetSuppressionFlags();
            return;
        }
        
        if (!apiKey) {
            statusElement.textContent = 'Please enter a valid API key';
            statusElement.style.color = 'red';
            buttonElement.innerHTML = originalButtonHTML;
            buttonElement.disabled = false;
            // Reset suppression flags
            this._resetSuppressionFlags();
            return;
        }
        
        // Make the API request
        HuntarrUtils.fetchWithTimeout(`/api/${app}/test-connection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                api_url: url,
                api_key: apiKey
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Test connection response:`, data);
            
            // Reset button
            buttonElement.disabled = false;
            
            if (data.success) {
                // Success
                buttonElement.innerHTML = '<i class="fas fa-plug"></i> Test Connection';
                
                let successMessage = `Connected successfully`;
                if (data.version) {
                    successMessage += ` (v${data.version})`;
                }
                
                // Show success message
                statusElement.textContent = successMessage;
                statusElement.style.color = 'green';
            } else {
                // Failure
                buttonElement.innerHTML = '<i class="fas fa-plug"></i> Test Connection';
                
                // Show error message
                const errorMsg = data.message || 'Connection failed';
                statusElement.textContent = errorMsg;
                statusElement.style.color = 'red';
            }
            
            // Reset suppression flags after a short delay to handle any potential redirects
            setTimeout(() => {
                this._resetSuppressionFlags();
            }, 500);
        })
        .catch(error => {
            console.error(`Connection test error:`, error);
            
            // Reset button
            buttonElement.innerHTML = originalButtonHTML;
            buttonElement.disabled = false;
            
            // Show error message
            statusElement.textContent = `Error: ${error.message}`;
            statusElement.style.color = 'red';
            
            // Reset suppression flags
            this._resetSuppressionFlags();
        });
    },
    
    // Helper method to reset unsaved changes suppression flags
    _resetSuppressionFlags: function() {
        // Reset all suppression flags
        if (window.huntarrUI) {
            window.huntarrUI.suppressUnsavedChangesCheck = false;
        }
        window._suppressUnsavedChangesDialog = false;
    },
};

// Add CSS for toggle circle
const styleEl = document.createElement('style');
styleEl.innerHTML = `
    .toggle-switch input:checked + .toggle-slider {
        background-color: #3498db !important;
    }
    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
    .toggle-switch input:checked + .toggle-slider:before {
        transform: translateX(20px);
    }
    
    /* Align setting help text 3 characters to the left */
    .setting-help {
        margin-left: -3ch !important;
    }
    
    /* Mobile-friendly dropdown styling */
    @media (max-width: 768px) {
        
        .setting-item select {
            width: 100% !important;
            max-width: none !important;
        }
    }
`;
document.head.appendChild(styleEl);
