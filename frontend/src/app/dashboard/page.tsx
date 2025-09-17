'use client'
import DashboardLayout from '@/components/Layout'
import styles from '@/styles/Dashboard.module.css'
import Address from '@/components/Address'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalBooks: number
  totalAuthors: number
  totalCategories: number
  totalPublishers: number
  totalUsers: number
  totalBorrows: number
  activeBorrows: number
  returnedBorrows: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Gọi từng API con để tổng hợp dashboard
        const [booksRes, authorsRes, categoriesRes, publishersRes, usersRes, borrowsRes] = await Promise.all([
          fetch('/api/books', { credentials: 'include' }),
          fetch('/api/authors', { credentials: 'include' }),
          fetch('/api/categories', { credentials: 'include' }),
          fetch('/api/publishers', { credentials: 'include' }),
          fetch('/api/users', { credentials: 'include' }),
          fetch('/api/borrow-return/borrows', { credentials: 'include' })
        ])

        // Kiểm tra response
        if (
          !booksRes.ok ||
          !authorsRes.ok ||
          !categoriesRes.ok ||
          !publishersRes.ok ||
          !usersRes.ok ||
          !borrowsRes.ok
        ) {
          throw new Error('Không thể tải dữ liệu thống kê')
        }

        // Đọc dữ liệu trả về
        const books = await booksRes.json()
        const authors = await authorsRes.json()
        const categories = await categoriesRes.json()
        const publishers = await publishersRes.json()
        const users = await usersRes.json()
        const borrows = await borrowsRes.json()

        // Giả sử mỗi API trả về { data: [...] }
        const borrowData = Array.isArray(borrows.data) ? borrows.data : []
        const statsData: DashboardStats = {
          totalBooks: Array.isArray(books.data) ? books.data.length : 0,
          totalAuthors: Array.isArray(authors.data) ? authors.data.length : 0,
          totalCategories: Array.isArray(categories.data) ? categories.data.length : 0,
          totalPublishers: Array.isArray(publishers.data) ? publishers.data.length : 0,
          totalUsers: Array.isArray(users.data) ? users.data.length : 0,
          totalBorrows: borrowData.length,
          activeBorrows: borrowData.filter((b: any) => b.status === 'MUON').length,
          returnedBorrows: borrowData.filter((b: any) => b.status === 'DA TRA').length
        }

        setStats(statsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <div className={styles['loading-state']}>
          <div className={styles['loading-spinner']}></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className={styles['error-state']}>
          <div className={styles['error-icon']}>⚠️</div>
          <p>{error}</p>
        </div>
      </DashboardLayout>
    )
  }


  return (
    <DashboardLayout>

      <div className={styles['dashboard-container']}>
        <header className={styles['dashboard-header']}>
          <h1 className={styles['dashboard-title']}>Tổng Quan Hệ Thống</h1>
          <p className={styles['dashboard-subtitle']}>Thống kê và báo cáo tổng quan về hoạt động của quản lý sách</p>
        </header>

        <div className={styles['dashboard-section']}>
          <h2 className={styles['section-title']}>Thống Kê Chung</h2>
          <div className={styles['dashboard-widgets']}>
            <div className={styles['dashboard-widget']}>
              <div className={styles['widget-icon']}>📚</div>
              <div className={styles['widget-content']}>
                <h3 className={styles['widget-title']}>Tổng Số Sách</h3>
                <div className={styles['widget-value']}>{stats?.totalBooks || 0}</div>
              </div>
            </div>

            <div className={styles['dashboard-widget']}>
              <div className={styles['widget-icon']}>✍️</div>
              <div className={styles['widget-content']}>
                <h3 className={styles['widget-title']}>Tác Giả</h3>
                <div className={styles['widget-value']}>{stats?.totalAuthors || 0}</div>
              </div>
            </div>

            <div className={styles['dashboard-widget']}>
              <div className={styles['widget-icon']}>🏷️</div>
              <div className={styles['widget-content']}>
                <h3 className={styles['widget-title']}>Thể Loại</h3>
                <div className={styles['widget-value']}>{stats?.totalCategories || 0}</div>
              </div>
            </div>

            <div className={styles['dashboard-widget']}>
              <div className={styles['widget-icon']}>🏢</div>
              <div className={styles['widget-content']}>
                <h3 className={styles['widget-title']}>Nhà Xuất Bản</h3>
                <div className={styles['widget-value']}>{stats?.totalPublishers || 0}</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles['dashboard-section']}>
          <h2 className={styles['section-title']}>Hoạt Động Mượn Trả</h2>
          <div className={styles['dashboard-widgets']}>
            <div className={styles['dashboard-widget']}>
              <div className={styles['widget-icon']}>📋</div>
              <div className={styles['widget-content']}>
                <h3 className={styles['widget-title']}>Tổng Số Phiếu Mượn</h3>
                <div className={styles['widget-value']}>{stats?.totalBorrows || 0}</div>
              </div>
            </div>

            <div className={styles['dashboard-widget']}>
              <div className={styles['widget-icon']}>📖</div>
              <div className={styles['widget-content']}>
                <h3 className={styles['widget-title']}>Đang Mượn</h3>
                <div className={styles['widget-value']}>{stats?.activeBorrows || 0}</div>
              </div>
            </div>

            <div className={styles['dashboard-widget']}>
              <div className={styles['widget-icon']}>✅</div>
              <div className={styles['widget-content']}>
                <h3 className={styles['widget-title']}>Đã Trả</h3>
                <div className={styles['widget-value']}>{stats?.returnedBorrows || 0}</div>
              </div>
            </div>

            <div className={styles['dashboard-widget']}>
              <div className={styles['widget-icon']}>👥</div>
              <div className={styles['widget-content']}>
                <h3 className={styles['widget-title']}>Tổng Người Dùng</h3>
                <div className={styles['widget-value']}>{stats?.totalUsers || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
