package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/pkg/jwt"
	"github.com/health-tech/backend/pkg/response"
)

const (
	CtxUserIDKey = "auth_user_id"
	CtxRoleKey   = "auth_user_role"
	CtxEmailKey  = "auth_user_email"
	CtxNameKey   = "auth_user_name"
)

func Auth(tm *jwt.TokenManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Unauthorized(c, "Authorization header required")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			response.Unauthorized(c, "Invalid Authorization format, expected Bearer <token>")
			c.Abort()
			return
		}

		claims, err := tm.ValidateToken(parts[1])
		if err != nil {
			response.Unauthorized(c, "Invalid or expired token")
			c.Abort()
			return
		}

		c.Set(CtxUserIDKey, claims.UserID)
		c.Set(CtxRoleKey, claims.Role)
		c.Set(CtxEmailKey, claims.Email)
		c.Set(CtxNameKey, claims.Name)

		c.Next()
	}
}

// RequireRole checks that authenticated user has one of allowed roles
func RequireRole(allowedRoles ...entity.UserRole) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get(CtxRoleKey)
		if !exists {
			response.Unauthorized(c, "Authentication required")
			c.Abort()
			return
		}

		userRole, ok := roleVal.(entity.UserRole)
		if !ok {
			response.Forbidden(c, "Role verification failed")
			c.Abort()
			return
		}

		// Organizers (Admins) always have superuser access to all routes
		if userRole == entity.RoleOrganizer {
			c.Next()
			return
		}

		for _, allowed := range allowedRoles {
			if userRole == allowed {
				c.Next()
				return
			}
		}

		response.Forbidden(c, "Access denied: insufficient permissions for your role")
		c.Abort()
	}
}

// CORS middleware
func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, PATCH, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

