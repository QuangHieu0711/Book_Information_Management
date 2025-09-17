'use client'
import DashboardLayout from '@/components/Layout'
import React, { useEffect, useState } from 'react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import listStyles from '../../styles/List.module.css'
import deleteModalStyles from '../../styles/DeleteModal.module.css'
import BookForm, { BookFormData } from './BookForm'
import BookDetailModal from './BookDetailModal'
import Toast from '../../components/Toast'

function DeleteBookModal({
  bookTitle,
  onClose,
  onConfirm,
  loading
}: {
  bookTitle: string
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}) {
  return (
    <div className={deleteModalStyles['modal-overlay']}>
      <div className={deleteModalStyles['modal-content']} style={{ maxWidth: 380, minWidth: 300 }}>
        <div className={deleteModalStyles['modal-title-bar']}>
          <div className={deleteModalStyles['modal-title']}>XÁC NHẬN XÓA</div>
          <button type='button' className={deleteModalStyles['close-btn']} onClick={onClose}>
            ×
          </button>
        </div>
        <div style={{ margin: '24px 0', fontSize: 16 }}>
          Bạn có chắc chắn muốn xóa sách <b>{bookTitle}</b>?
        </div>
        <div className={deleteModalStyles['form-footer']}>
          <button type='button' onClick={onClose} className={deleteModalStyles['btn-cancel']}>
            Hủy bỏ
          </button>
          <button type='button' className={deleteModalStyles['btn-confirm']} disabled={loading} onClick={onConfirm}>
            {loading ? 'Đang xóa...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Kiểu dữ liệu trả về từ API /api/books (đã resolve tên author/category/publisher)
type Book = {
  id: number
  title: string
  author: string
  authorId: number
  category: string
  categoryId: number
  publisher: string
  publisherId: number
  yearPublished: number
  price: number
  quantity: number
  quantityAvailable: number
  description: string
  language: string
  createdAt: string
}

const PAGE_SIZE = 14

function BookListContent() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // State cho modal form
  const [showAdd, setShowAdd] = useState(false)
  const [editBook, setEditBook] = useState<BookFormData | null>(null)
  const [viewBook, setViewBook] = useState<Book | null>(null)

  // State cho modal xóa
  const [deleteBook, setDeleteBook] = useState<Book | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Thông báo thành công
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null)

  // Lấy danh sách sách
  const fetchBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/books', { credentials: 'include' })
      const json = await res.json()
      if (json.status && Array.isArray(json.data)) {
        setBooks(json.data)
      } else {
        setError(json.userMessage || 'Lỗi lấy danh sách sách')
      }
    } catch (err) {
      setError('Không thể kết nối tới server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  // Sắp xếp theo thời gian tạo (createdAt) mới nhất lên đầu
  const sortedBooks = [...books].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Filter books by title, author, category, publisher, language
  const filtered = sortedBooks.filter(
    book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase()) ||
      book.publisher.toLowerCase().includes(search.toLowerCase()) ||
      book.language.toLowerCase().includes(search.toLowerCase())
  )

  // Paging
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pagedBooks = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleView = (book: Book) => {
    setViewBook(book)
  }

  const handleEdit = (book: Book) => {
    setEditBook({
      id: book.id,
      title: book.title,
      authorId: String(book.authorId),
      categoryId: String(book.categoryId),
      publisherId: String(book.publisherId),
      yearPublished: book.yearPublished,
      price: String(book.price),
      quantity: String(book.quantity),
      description: book.description,
      language: book.language
    })
  }

  const handleDeleteClick = (book: Book) => {
    setDeleteBook(book)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteBook) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/books/${deleteBook.id}`, { method: 'DELETE', credentials: 'include' })
      const json = await res.json()
      if (json.status) {
        setDeleteBook(null)
        fetchBooks()
        setToast({ message: 'Xóa sách thành công', type: 'success' })
      } else {
        setToast({ message: json.userMessage || 'Xóa thất bại', type: 'error' })
      }
    } catch {
      setToast({ message: 'Lỗi mạng hoặc server', type: 'error' })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handlePrevPage = () => setPage(p => Math.max(1, p - 1))
  const handleNextPage = () => setPage(p => Math.min(totalPages, p + 1))

  useEffect(() => {
    setPage(1)
  }, [search])

  const handleSuccess = (msg: string) => {
    fetchBooks()
    setToast({ message: msg, type: 'success' })
  }

  if (loading) return <div>Đang tải...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div className={listStyles['list-container']}>
      <div className={listStyles['list-toolbar']}>
        <button className={listStyles['list-add-btn']} onClick={() => setShowAdd(true)}>
          + Thêm sách
        </button>
        <input
          type='text'
          className={listStyles['list-search']}
          placeholder='Tìm kiếm tên sách, tác giả, thể loại...'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table className={listStyles['list-table']}>
        <thead>
          <tr>
            <th className={listStyles['stt-header']}>STT</th>
            <th>Tên sách</th>
            <th>Tác giả</th>
            <th>Thể loại</th>
            <th>NXB</th>
            <th>Năm XB</th>
            <th>Giá</th>
            <th>SL còn</th>
            <th>Ngôn ngữ</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pagedBooks.length === 0 ? (
            <tr>
              <td colSpan={11} style={{ textAlign: 'center', padding: 24 }}>
                Không có sách nào.
              </td>
            </tr>
          ) : (
            pagedBooks.map((b, idx) => (
              <tr key={b.id}>
                <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category}</td>
                <td>{b.publisher}</td>
                <td>{b.yearPublished}</td>
                <td>{b.price.toLocaleString()}₫</td>
                <td>{b.quantityAvailable}</td>
                <td>{b.language}</td>
                <td>{b.createdAt ? b.createdAt.substring(0, 10) : ''}</td>
                <td>
                  <button className={listStyles['list-action-btn']} title='Xem' onClick={() => handleView(b)}>
                    <FaEye color='#2563eb' />
                  </button>
                  <button className={listStyles['list-action-btn']} title='Sửa' onClick={() => handleEdit(b)}>
                    <FaEdit color='#f59e42' />
                  </button>
                  <button className={listStyles['list-action-btn']} title='Xóa' onClick={() => handleDeleteClick(b)}>
                    <FaTrash color='#ef4444' />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className={listStyles['list-pagination']}>
        <button className={listStyles['list-pagination-btn']} onClick={handlePrevPage} disabled={page === 1}>
          Trang trước
        </button>
        <span className={listStyles['list-pagination-info']}>
          Trang {page}/{totalPages || 1}
        </span>
        <button
          className={listStyles['list-pagination-btn']}
          onClick={handleNextPage}
          disabled={page === totalPages || totalPages === 0}
        >
          Trang sau
        </button>
      </div>
      {/* Modal form */}
      {showAdd && (
        <BookForm
          mode='add'
          onClose={() => setShowAdd(false)}
          onSuccess={() => handleSuccess('Thêm sách thành công')}
        />
      )}
      {editBook && (
        <BookForm
          mode='edit'
          book={editBook}
          onClose={() => setEditBook(null)}
          onSuccess={() => handleSuccess('Cập nhật sách thành công')}
        />
      )}
      {deleteBook && (
        <DeleteBookModal
          bookTitle={deleteBook.title}
          loading={deleteLoading}
          onClose={() => setDeleteBook(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {viewBook && <BookDetailModal book={viewBook} onClose={() => setViewBook(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default function BookListPage() {
  return (
    <DashboardLayout>
      <BookListContent />
    </DashboardLayout>
  )
}
