# 📁 data/

This directory is used to store runtime-generated data for the application.

## Purpose

It contains the `ohlc.json` file, which holds the aggregated OHLC (Open, High, Low, Close) weather data per city and hour. This allows the application to:

- Restore previous state between restarts
- Persist data without a database
- Serve consistent results through the REST API

## Notes

- The `ohlc.json` file is **excluded from version control** via `.gitignore`.
- You can safely delete the file if you want to reset the aggregation state.
- Do **not** manually edit this file unless you know what you're doing.

## Structure

Example contents of `ohlc.json`:

```json
{
  "Berlin": {
    "2025-07-05T14:00:00.000Z": {
      "open": 23.5,
      "high": 27.1,
      "low": 21.4,
      "close": 25.3
    }
  }
}
```
