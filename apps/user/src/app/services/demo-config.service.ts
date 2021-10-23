import { Injectable } from '@angular/core';
import { CONFIG } from '../app.config';

type AppConfigType = typeof CONFIG.demo.default;

const key = 'am-users--demo-config';

@Injectable({
  providedIn: 'root'
})
export class DemoConfigService {

  public get config() { return this._config ?? this.loadConfig() ?? CONFIG.demo.default }
  set config(config: AppConfigType) { this.saveConfig(this._config = config) }

  _config?: AppConfigType;

  saveConfig(config: AppConfigType) {
console.log('Saving to local storage')
    localStorage.setItem(key, JSON.stringify(config ?? null));
  }

  loadConfig(): AppConfigType | null {
    try {
      const config: AppConfigType = JSON.parse(localStorage.getItem(key) ?? JSON.stringify(null));
      if ( ! config ) return null;
      if ( typeof config.errorProbability !== 'number' || !isFinite(config.errorProbability) ) return null;
      config.errorProbability = Math.max(0, Math.min(1, config.errorProbability));
      if ( typeof config.maxDelay !== 'number' || !isFinite(config.maxDelay)) return null;
      config.maxDelay = Math.max(0, Math.min(CONFIG.demo.liveConfig.maxMaxDelay, config.maxDelay));
      return {
        errorProbability: config.errorProbability,
        maxDelay: config.maxDelay
      };
    } catch(e) {
      return null;
    }
  }
}
