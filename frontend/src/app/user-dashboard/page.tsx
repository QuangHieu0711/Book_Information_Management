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

const BOOKS_PER_PAGE = 12

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  // Reset về trang 1 khi search thay đổi
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  // Lọc sách theo từ khóa tìm kiếm
  const filteredBooks = books.filter(
    book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase())
  )

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE
  const endIndex = startIndex + BOOKS_PER_PAGE
  const currentBooks = filteredBooks.slice(startIndex, endIndex)

  // Tạo array số trang để hiển thị
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.container}>
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
