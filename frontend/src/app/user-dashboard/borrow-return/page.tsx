'use client'
import React, { useEffect, useState } from 'react'
import styles from '../../../styles/BorrowList.module.css'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale/vi'

type BorrowDetail = {
  bookId: number
  quantity: number
  bookTitle?: string
}

type Borrow = {
  id: number
  userName: string
  userId: number
  borrowDate: string
  returnDate: string
  actualReturnDate: string | null
  status: string
  createdAt: string
  totalBooks: number
  totalQuantity: number
  borrowDetails: BorrowDetail[]
}

function BorrowReturn() {
  const [borrows, setBorrows] = useState<Borrow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalBorrows: 0,
    totalBooks: 0,
    pendingReturns: 0
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    fetchBorrows()
  }, [currentPage])

  const fetchBorrows = async () => {
    try {
      let userId: number | null = null
      const userJson = localStorage.getItem('user') || sessionStorage.getItem('user')
      if (userJson) {
        const userObj = JSON.parse(userJson)
        userId = userObj.userId
      }

      if (!userId) {
        setError('Không tìm thấy thông tin người dùng')
        return
      }

      // Fetch borrows
      const res = await fetch(`/api/borrow-return/borrows?page=${currentPage}&size=${itemsPerPage}`, {
        credentials: 'include'
      })
      const json = await res.json()

      if (json.status && Array.isArray(json.data)) {
        const userBorrows = json.data.filter((b: any) => b.userId === userId)
        
        // Fetch books data for titles
        const booksRes = await fetch('/api/books', { credentials: 'include' })
        const booksJson = await booksRes.json()
        const booksMap = new Map(
          booksJson.data.map((book: any) => [book.id, book.title])
        )
        
        const borrowsWithDetails = await Promise.all(
          userBorrows.map(async (borrow: any) => {
            // Fetch borrow details
            const detailsRes = await fetch(`/api/borrow-return/borrow-details?borrowId=${borrow.id}`, {
              credentials: 'include'
            })
            const detailsJson = await detailsRes.json()
            const details = detailsJson.status ? detailsJson.data : []

            // Add book titles to details
            const detailsWithTitles = details.map((detail: any) => ({
              ...detail,
              bookTitle: booksMap.get(detail.bookId) || `Sách #${detail.bookId}`
            }))

            return {
              ...borrow,
              borrowDetails: detailsWithTitles,
              totalBooks: details.length,
              totalQuantity: details.reduce((sum: number, d: any) => sum + d.quantity, 0)
            }
          })
        )

        setBorrows(borrowsWithDetails)

        // Calculate stats
        setStats({
          totalBorrows: userBorrows.length,
          totalBooks: borrowsWithDetails.reduce((acc, b) => acc + b.totalBooks, 0),
          pendingReturns: borrowsWithDetails.filter(b => b.status === 'MUON').length
        })

        // Update pagination
        setTotalPages(Math.ceil(userBorrows.length / itemsPerPage))
      }
    } catch (err) {
      setError('Không thể tải danh sách phiếu mượn')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi })
  }

  if (loading) {
    return <div className={styles['empty-state']}>Đang tải...</div>
  }

  if (error) {
    return <div className={styles['empty-state']}>{error}</div>
  }

  return (
    <div className={styles['borrow-container']}>
      <div className={styles.header}>
        <h1 className={styles.title}>Phiếu Mượn Của Tôi</h1>
      </div>

      <div className={styles['stats-container']}>
        <div className={styles['stat-card']}>
          <div className={styles['stat-title']}>Tổng Số Phiếu Mượn</div>
          <div className={styles['stat-value']}>{stats.totalBorrows}</div>
        </div>
        <div className={styles['stat-card']}>
          <div className={styles['stat-title']}>Tổng Số Đầu Sách</div>
          <div className={styles['stat-value']}>{stats.totalBooks}</div>
        </div>
        <div className={styles['stat-card']}>
          <div className={styles['stat-title']}>Đang Mượn</div>
          <div className={styles['stat-value']}>{stats.pendingReturns}</div>
        </div>
      </div>

      {borrows.length === 0 ? (
        <div className={styles['empty-state']}>
          Bạn chưa có phiếu mượn nào
        </div>
      ) : (
        <>
          <div className={styles['borrow-grid']}>
            {borrows.map(borrow => (
              <div key={borrow.id} className={styles['borrow-card']}>
                <div className={styles['card-header']}>
                  <div className={styles['borrow-id']}>Phiếu #{borrow.id.toString().padStart(4, '0')}</div>
                  <div className={styles[`status-badge status-${borrow.status.toLowerCase().replace(' ', '-')}`]}>
                    {borrow.status === 'MUON' ? 'ĐANG MƯỢN' : 'ĐÃ TRẢ'}
                  </div>
                </div>

                <div className={styles['card-content']}>
                  <div className={styles['info-row']}>
                    <span className={styles['info-label']}>Ngày mượn:</span>
                    <span className={styles['info-value']}>{formatDate(borrow.borrowDate)}</span>
                  </div>
                  <div className={styles['info-row']}>
                    <span className={styles['info-label']}>Ngày hẹn trả:</span>
                    <span className={styles['info-value']}>{formatDate(borrow.returnDate)}</span>
                  </div>
                  {borrow.actualReturnDate && (
                    <div className={styles['info-row']}>
                      <span className={styles['info-label']}>Ngày trả thực tế:</span>
                      <span className={styles['info-value']}>{formatDate(borrow.actualReturnDate)}</span>
                    </div>
                  )}
                  <div className={styles['info-row']}>
                    <span className={styles['info-label']}>Số đầu sách:</span>
                    <span className={styles['info-value']}>{borrow.totalBooks}</span>
                  </div>
                  <div className={styles['info-row']}>
                    <span className={styles['info-label']}>Tổng số lượng:</span>
                    <span className={styles['info-value']}>{borrow.totalQuantity}</span>
                  </div>
                </div>

                <div className={styles['book-list']}>
                  <h4 className={styles['book-list-title']}>Chi tiết sách mượn:</h4>
                  {borrow.borrowDetails.map((detail, idx) => (
                    <div key={idx} className={styles['book-item']}>
                      <span className={styles['book-title']}>{detail.bookTitle}</span>
                      <span className={styles['book-quantity']}>x{detail.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <button
              className={styles['page-button']}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`${styles['page-button']} ${currentPage === page ? styles.active : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className={styles['page-button']}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Tiếp
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default BorrowReturn
