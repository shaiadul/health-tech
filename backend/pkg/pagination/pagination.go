package pagination

import (
	"math"
	"strconv"
)

type Params struct {
	Page     int    `json:"page"`
	PageSize int    `json:"pageSize"`
	Search   string `json:"search"`
	SortBy   string `json:"sortBy"`
	SortOrder string `json:"sortOrder"`
}

type Meta struct {
	CurrentPage  int   `json:"currentPage"`
	PageSize     int   `json:"pageSize"`
	TotalItems   int64 `json:"totalItems"`
	TotalPages   int   `json:"totalPages"`
	HasNextPage  bool  `json:"hasNextPage"`
	HasPrevPage  bool  `json:"hasPrevPage"`
}

type PageResult[T any] struct {
	Data []T  `json:"data"`
	Meta Meta `json:"meta"`
}

func ParseParams(pageStr, pageSizeStr, search, sortBy, sortOrder string) Params {
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		page = 1
	}

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 || pageSize > 100 {
		pageSize = 10
	}

	if sortOrder != "asc" && sortOrder != "desc" {
		sortOrder = "desc"
	}

	return Params{
		Page:      page,
		PageSize:  pageSize,
		Search:    search,
		SortBy:    sortBy,
		SortOrder: sortOrder,
	}
}

func (p Params) Offset() int {
	return (p.Page - 1) * p.PageSize
}

func (p Params) Limit() int {
	return p.PageSize
}

func NewMeta(totalItems int64, page, pageSize int) Meta {
	totalPages := int(math.Ceil(float64(totalItems) / float64(pageSize)))
	if totalPages == 0 {
		totalPages = 1
	}

	return Meta{
		CurrentPage: page,
		PageSize:    pageSize,
		TotalItems:  totalItems,
		TotalPages:  totalPages,
		HasNextPage: page < totalPages,
		HasPrevPage: page > 1,
	}
}

