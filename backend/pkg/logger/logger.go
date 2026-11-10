package logger

import (
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		rawQuery := c.Request.URL.RawQuery
		method := c.Request.Method
		clientIP := c.ClientIP()

		c.Next()

		latency := time.Since(start)
		statusCode := c.Writer.Status()
		errorMessage := c.Errors.ByType(gin.ErrorTypePrivate).String()

		statusColor := "\033[97;42m" // Green
		if statusCode >= 400 && statusCode < 500 {
			statusColor = "\033[90;43m" // Yellow
		} else if statusCode >= 500 {
			statusColor = "\033[97;41m" // Red
		}
		resetColor := "\033[0m"

		query := ""
		if rawQuery != "" {
			query = "?" + rawQuery
		}

		log.Printf("[MEDPULSE-API] %s %3d %s | %13v | %15s | %-7s %s%s %s",
			statusColor, statusCode, resetColor,
			latency,
			clientIP,
			method,
			path,
			query,
			errorMessage,
		)
	}
}

func Info(format string, v ...interface{}) {
	log.Printf("[INFO] "+format, v...)
}

func Error(format string, v ...interface{}) {
	log.Printf(fmt.Sprintf("\033[31m[ERROR]\033[0m "+format), v...)
}

