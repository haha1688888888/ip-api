export class KVStorage {
  constructor(kv) {
    this.kv = kv
  }

  async getConfig() {
    try {
      if (!this.kv) return null
      const config = await this.kv.get('config')
      return config ? JSON.parse(config) : null
    } catch (error) {
      console.error('Error reading config from KV:', error)
      return null
    }
  }

  async setConfig(config) {
    try {
      if (!this.kv) return false
      await this.kv.put('config', JSON.stringify(config), {
        expirationTtl: 31536000
      })
      return true
    } catch (error) {
      console.error('Error saving config to KV:', error)
      return false
    }
  }

  async addLoginLog(logEntry) {
    try {
      if (!this.kv) return false
      const logs = await this.getLogs()
      logs.unshift({
        ...logEntry,
        timestamp: Date.now()
      })
      // Keep only the latest 100 logs
      const limitedLogs = logs.slice(0, 100)
      await this.kv.put('logs', JSON.stringify(limitedLogs), {
        expirationTtl: 31536000
      })
      return true
    } catch (error) {
      console.error('Error adding login log:', error)
      return false
    }
  }

  async getLogs() {
    try {
      if (!this.kv) return []
      const logs = await this.kv.get('logs')
      return logs ? JSON.parse(logs) : []
    } catch (error) {
      console.error('Error reading logs from KV:', error)
      return []
    }
  }

  async getLastLoginStatus() {
    try {
      const logs = await this.getLogs()
      return logs.length > 0 ? logs[0] : null
    } catch (error) {
      console.error('Error getting last login status:', error)
      return null
    }
  }

  async clearLogs() {
    try {
      if (!this.kv) return false
      await this.kv.delete('logs')
      return true
    } catch (error) {
      console.error('Error clearing logs:', error)
      return false
    }
  }
}
