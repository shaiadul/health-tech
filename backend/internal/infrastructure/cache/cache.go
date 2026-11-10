package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
)

type Cache interface {
	Get(ctx context.Context, key string, target interface{}) error
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Delete(ctx context.Context, key string) error
	DeletePrefix(ctx context.Context, prefix string) error
}

type RedisCache struct {
	client    *redis.Client
	namespace string
}

type RedisConfig struct {
	URL       string
	Addr      string
	Username  string
	Password  string
	DB        int
	Namespace string
}

func NewRedisCache(cfg RedisConfig) (*RedisCache, error) {
	var opt *redis.Options

	if cfg.URL != "" {
		parsedOpt, err := redis.ParseURL(cfg.URL)
		if err == nil {
			opt = parsedOpt
		}
	}

	if opt == nil {
		addr := cfg.Addr
		if addr == "" {
			addr = "gleeful-need-songs-41741.db.redis.io:10970"
		}
		opt = &redis.Options{
			Addr: addr,
		}
	}

	if cfg.Username != "" {
		opt.Username = cfg.Username
	}
	if cfg.Password != "" {
		opt.Password = cfg.Password
	}
	opt.DB = cfg.DB

	opt.DialTimeout = 5 * time.Second
	opt.ReadTimeout = 3 * time.Second
	opt.WriteTimeout = 3 * time.Second
	opt.MaxRetries = 2

	client := redis.NewClient(opt)

	// Ping to verify authentication and connection
	ctx, cancel := context.WithTimeout(context.Background(), 4*time.Second)
	defer cancel()
	if err := client.Ping(ctx).Err(); err != nil {
		_ = client.Close()
		return nil, fmt.Errorf("redis connection failed: %w", err)
	}

	return &RedisCache{
		client:    client,
		namespace: strings.TrimSpace(cfg.Namespace),
	}, nil
}

func (r *RedisCache) formatKey(key string) string {
	if r.namespace != "" {
		return fmt.Sprintf("%s:%s", r.namespace, key)
	}
	return key
}

func (r *RedisCache) Get(ctx context.Context, key string, target interface{}) error {
	fullKey := r.formatKey(key)
	val, err := r.client.Get(ctx, fullKey).Result()
	if err != nil {
		return err
	}
	return json.Unmarshal([]byte(val), target)
}

func (r *RedisCache) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	fullKey := r.formatKey(key)
	bytes, err := json.Marshal(value)
	if err != nil {
		return err
	}
	return r.client.Set(ctx, fullKey, bytes, expiration).Err()
}

func (r *RedisCache) Delete(ctx context.Context, key string) error {
	fullKey := r.formatKey(key)
	return r.client.Del(ctx, fullKey).Err()
}

func (r *RedisCache) DeletePrefix(ctx context.Context, prefix string) error {
	fullPrefix := r.formatKey(prefix)
	iter := r.client.Scan(ctx, 0, fullPrefix+"*", 0).Iterator()
	for iter.Next(ctx) {
		_ = r.client.Del(ctx, iter.Val()).Err()
	}
	return iter.Err()
}

// MemoryCache fallback when remote cache is starting up or temporarily offline
type MemoryCache struct {
	store     map[string]memItem
	namespace string
}

type memItem struct {
	data      []byte
	expiresAt time.Time
}

func NewMemoryCache(namespace string) *MemoryCache {
	return &MemoryCache{
		store:     make(map[string]memItem),
		namespace: strings.TrimSpace(namespace),
	}
}

func (m *MemoryCache) formatKey(key string) string {
	if m.namespace != "" {
		return fmt.Sprintf("%s:%s", m.namespace, key)
	}
	return key
}

func (m *MemoryCache) Get(ctx context.Context, key string, target interface{}) error {
	fullKey := m.formatKey(key)
	item, ok := m.store[fullKey]
	if !ok || (!item.expiresAt.IsZero() && time.Now().After(item.expiresAt)) {
		return redis.Nil
	}
	return json.Unmarshal(item.data, target)
}

func (m *MemoryCache) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	fullKey := m.formatKey(key)
	data, err := json.Marshal(value)
	if err != nil {
		return err
	}
	var exp time.Time
	if expiration > 0 {
		exp = time.Now().Add(expiration)
	}
	m.store[fullKey] = memItem{data: data, expiresAt: exp}
	return nil
}

func (m *MemoryCache) Delete(ctx context.Context, key string) error {
	fullKey := m.formatKey(key)
	delete(m.store, fullKey)
	return nil
}

func (m *MemoryCache) DeletePrefix(ctx context.Context, prefix string) error {
	fullPrefix := m.formatKey(prefix)
	for k := range m.store {
		if strings.HasPrefix(k, fullPrefix) {
			delete(m.store, k)
		}
	}
	return nil
}


