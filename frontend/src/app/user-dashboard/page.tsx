'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from '../../styles/BooksList.module.css'

interface Book {
  id: number
  title: string
  author: string
  category: string
  yearPublished: number
  price: number
  quantity: number
  imageUrl?: string
  publisher?: string
  description?: string
}

const BOOKS_PER_PAGE = 15

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false)
  const [fullName, setFullName] = useState<string>('User')

  useEffect(() => {
    let name = 'User'
    try {
      const userJson = localStorage.getItem('user') || sessionStorage.getItem('user')
      if (userJson) {
        const userObj = JSON.parse(userJson)
        name = userObj.fullName || userObj.username || 'User'
      }
    } catch (e) {}
    setFullName(name)
  }, [])

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const filteredBooks = books.filter(
    book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE
  const endIndex = startIndex + BOOKS_PER_PAGE
  const currentBooks = filteredBooks.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

      if (startPage > 1) {
        pages.push(1)
        if (startPage > 2) pages.push('...')
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    window.location.href = '/login'
  }

  const handleLoanHistory = () => {
    window.location.href = '/user-dashboard/loans'
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  return (
    <div className={styles.container}>
      {/* Custom header bar */}
      <header className={styles.customHeader}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 24 24" width={28} height={28} fill="none">
              <rect width="24" height="24" rx="6" fill="url(#paint0_linear)" />
              <path d="M7 8.5V16C7 16.8284 7.67157 17.5 8.5 17.5H17" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M17 8.5V16C17 16.8284 16.3284 17.5 15.5 17.5H7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M7 8.5C7 7.67157 7.67157 7 8.5 7H17" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M17 8.5C17 7.67157 16.3284 7 15.5 7H7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              <defs>
                <linearGradient id="paint0_linear" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4F46E5"/>
                  <stop offset="1" stopColor="#A855F7"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className={styles.siteTitle}>QUẢN LÝ THÔNG TIN SÁCH</span>
        </div>
        <div className={styles.userSection}>
          <div className={styles.userInfoOnly}>
            <span className={styles.userName}>{fullName}</span>
          </div>
          <button
            className={styles.dropdownBtn}
            onClick={() => setShowUserMenu(v => !v)}
            aria-label="Menu người dùng"
          >
            <svg width={16} height={16} viewBox="0 0 20 20" fill="none">
              <path d="M5.25 7.75L10 12.25L14.75 7.75" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {showUserMenu && (
          <div className={styles.userMenu}>
            <Link href="/user-dashboard/borrow-return" className={styles.menuItem}>
              <span className={styles.menuIcon}>📄</span>
              Phiếu mượn của tôi
            </Link>
            <button className={styles.menuItem} onClick={handleLogout}>
              <span className={styles.menuIcon}>🚪</span>
              Đăng xuất
            </button>
          </div>
          )}
        </div>
      </header>

      <div className={styles.header}>
        <h1 className={styles.title}>📚 QUẢN LÝ THÔNG TIN SÁCH</h1>
        <p className={styles.subtitle}>Khám phá bộ sưu tập sách phong phú với {books.length} đầu sách</p>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} viewBox='0 0 20 20' fill='currentColor'>
            <path
              fillRule='evenodd'
              d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
              clipRule='evenodd'
            />
          </svg>
          <input
            className={styles.searchInput}
            type='text'
            placeholder='Tìm kiếm theo tên sách, tác giả, thể loại...'
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.resultsInfo}>
          {search ? (
            <span>
              Tìm thấy <strong>{filteredBooks.length}</strong> kết quả cho "{search}"
            </span>
          ) : (
            <span>
              Hiển thị <strong>{currentBooks.length}</strong> trong tổng số <strong>{books.length}</strong> sách
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải danh sách sách...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>📖</div>
          <h3>Không tìm thấy sách nào</h3>
          <p>Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {currentBooks.map(book => (
              <div className={styles.card} key={book.id}>
                <div className={styles.cardImageWrapper}>
                  {book.imageUrl ? (
                    <img src={book.imageUrl} alt={book.title} className={styles.bookImg} />
                  ) : (
                    <div className={styles.placeholderImg}>📚</div>
                  )}
                  <div className={styles.stockBadge}>Còn {book.quantity}</div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    <Link href={`/books/${book.id}`}>{book.title}</Link>
                  </h3>

                  <div className={styles.cardInfo}>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Tác giả:</span>
                      <span className={styles.infoValue}>{book.author}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Thể loại:</span>
                      <span className={styles.infoValue}>{book.category}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>Năm XB:</span>
                      <span className={styles.infoValue}>{book.yearPublished}</span>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.price}>{book.price?.toLocaleString('vi-VN')}₫</div>
                    <Link href={`/user-dashboard/books/${book.id}`} className={styles.detailBtn}>
                      Chi tiết
                      <svg viewBox='0 0 20 20' fill='currentColor'>
                        <path
                          fillRule='evenodd'
                          d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={`${styles.paginationBtn} ${styles.prevNextBtn}`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Trước
              </button>

              <div className={styles.pageNumbers}>
                {getPageNumbers().map((page, index) => (
                  <span key={index}>
                    {page === '...' ? (
                      <span className={styles.ellipsis}>...</span>
                    ) : (
                      <button
                        className={`${styles.paginationBtn} ${currentPage === page ? styles.active : ''}`}
                        onClick={() => handlePageChange(page as number)}
                      >
                        {page}
                      </button>
                    )}
                  </span>
                ))}
              </div>

              <button
                className={`${styles.paginationBtn} ${styles.prevNextBtn}`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
                <svg viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
