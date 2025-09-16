'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../../../../styles/BookDetail.module.css'

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

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/books/${params.id}`)
      .then(res => res.json())
      .then(data => setBook(data.data))
      .finally(() => setLoading(false))
  }, [params?.id])

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingContainer}>
          <div className={styles.bookLoader}>
            <div className={styles.bookPages}></div>
            <div className={styles.bookCover}></div>
          </div>
          <h3>Đang tải thông tin sách...</h3>
          <p>Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className={styles.notFoundWrapper}>
        <div className={styles.notFoundContainer}>
          <div className={styles.notFoundIcon}>📚</div>
          <h2>Oops! Không tìm thấy sách</h2>
          <p>Cuốn sách bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại</p>
          <Link href='/books' className={styles.backToListBtn}>
            <svg viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            Quay về danh sách sách
          </Link>
        </div>
      </div>
    )
  }

  const isAvailable = book.quantity > 0
  const isLowStock = book.quantity <= 3 && book.quantity > 0

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        {/* Breadcrumb Navigation */}
        <nav className={styles.breadcrumb}>
          <Link href='/user-dashboard' className={styles.breadcrumbLink}>
            <svg viewBox='0 0 20 20' fill='currentColor'>
              <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
            </svg>
            Thư viện sách
          </Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Chi tiết sách</span>
        </nav>

        {/* Main Content */}
        <div className={styles.bookDetail}>
          <div className={styles.bookImageContainer}>
            <div className={styles.imageWrapper}>
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className={`${styles.bookImage} ${imageLoaded ? styles.loaded : ''}`}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className={styles.placeholderImage}>
                  <div className={styles.placeholderIcon}>📖</div>
                  <span>Không có hình ảnh</span>
                </div>
              )}

              {/* Stock Badge */}
              <div
                className={`${styles.stockBadge} ${
                  !isAvailable ? styles.outOfStock : isLowStock ? styles.lowStock : styles.inStock
                }`}
              >
                {!isAvailable ? 'Hết hàng' : isLowStock ? `Chỉ còn ${book.quantity}` : `Còn ${book.quantity}`}
              </div>
            </div>
          </div>

          <div className={styles.bookInfo}>
            <div className={styles.bookHeader}>
              <div className={styles.categoryTag}>{book.category}</div>
              <h1 className={styles.bookTitle}>{book.title}</h1>
              <p className={styles.authorName}>
                <span>bởi</span> <strong>{book.author}</strong>
              </p>
            </div>

            <div className={styles.bookMeta}>
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>🏢</span>
                  <div className={styles.metaContent}>
                    <span className={styles.metaLabel}>Nhà xuất bản</span>
                    <span className={styles.metaValue}>{book.publisher || 'Không rõ'}</span>
                  </div>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>📅</span>
                  <div className={styles.metaContent}>
                    <span className={styles.metaLabel}>Năm xuất bản</span>
                    <span className={styles.metaValue}>{book.yearPublished}</span>
                  </div>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>💰</span>
                  <div className={styles.metaContent}>
                    <span className={styles.metaLabel}>Giá tiền</span>
                    <span className={styles.metaPrice}>{book.price?.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaIcon}>📦</span>
                  <div className={styles.metaContent}>
                    <span className={styles.metaLabel}>Tình trạng</span>
                    <span className={`${styles.metaValue} ${isAvailable ? styles.available : styles.unavailable}`}>
                      {isAvailable ? 'Có sẵn' : 'Hết hàng'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.description}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📝</span>
                Mô tả sách
              </h3>
              <div className={styles.descriptionContent}>
                {book.description ? (
                  <>
                    <p className={showFullDescription ? '' : styles.truncated}>{book.description}</p>
                    {book.description.length > 200 && (
                      <button
                        className={styles.toggleDescription}
                        onClick={() => setShowFullDescription(!showFullDescription)}
                      >
                        {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                      </button>
                    )}
                  </>
                ) : (
                  <p className={styles.noDescription}>Chưa có mô tả cho cuốn sách này.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
