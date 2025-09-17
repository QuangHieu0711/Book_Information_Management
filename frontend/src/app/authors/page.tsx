'use client'
import DashboardLayout from '@/components/Layout'
import React, { useEffect, useState } from 'react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import listStyles from '../../styles/List.module.css'
import deleteModalStyles from '../../styles/DeleteModal.module.css'
import AuthorForm, { AuthorEditForm } from './AuthorForm'
import AuthorDetailModal from './AuthorDetailModal'
import Toast from '../../components/Toast'

function DeleteAuthorModal({
  authorname,
  onClose,
  onConfirm,
  loading,
}: {
  authorname: string
  onClose: () => void
  onConfirm: () => void
  loading: boolean
}) {
  return (
    <div className={deleteModalStyles['modal-overlay']}>
      <div className={deleteModalStyles['modal-content']} style={{ maxWidth: 380, minWidth: 300 }}>
        <div className={deleteModalStyles['modal-title-bar']}>
          <div className={deleteModalStyles['modal-title']}>XÁC NHẬN XÓA</div>
          <button type="button" className={deleteModalStyles['close-btn']} onClick={onClose}>
            ×
          </button>
        </div>
        <div style={{ margin: '24px 0', fontSize: 16 }}>
          Bạn có chắc chắn muốn xóa tác giả <b>{authorname}</b>?
        </div>
        <div className={deleteModalStyles['form-footer']}>
          <button type="button" onClick={onClose} className={deleteModalStyles['btn-cancel']}>
            Hủy bỏ
          </button>
          <button
            type="button"
            className={deleteModalStyles['btn-confirm']}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? 'Đang xóa...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  )
}

type Author = {
  id: number
  authorname: string
  birthYear: number
  nationality: string
  createdAt: string
}

const PAGE_SIZE = 15

function AuthorListContent() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // State cho modal form
  const [showAdd, setShowAdd] = useState(false)
  const [editAuthor, setEditAuthor] = useState<AuthorEditForm | null>(null)
  const [viewAuthor, setViewAuthor] = useState<Author | null>(null)

  // State cho modal xóa
  const [deleteAuthor, setDeleteAuthor] = useState<Author | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Thông báo thành công
  const [toast, setToast] = useState<{message: string, type?: 'success'|'error'}|null>(null)

  // Lấy danh sách author
  const fetchAuthors = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/authors', { credentials: 'include' })
      const json = await res.json()
      if (json.status && Array.isArray(json.data)) {
        setAuthors(json.data)
      } else {
        setError(json.userMessage || 'Lỗi lấy danh sách tác giả')
      }
    } catch (err) {
      setError('Không thể kết nối tới server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthors()
  }, [])

  // Sắp xếp theo thời gian tạo (createdAt) mới nhất lên đầu
  const sortedAuthors = [...authors].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Filter authors by authorname or nationality
  const filtered = sortedAuthors.filter(a =>
    a.authorname.toLowerCase().includes(search.toLowerCase()) ||
    a.nationality.toLowerCase().includes(search.toLowerCase())
  )

  // Paging
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pagedAuthors = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleView = (author: Author) => {
    setViewAuthor(author)
  }

  const handleEdit = (author: Author) => {
    setEditAuthor({
      id: author.id,
      authorname: author.authorname,
      birthYear: author.birthYear,
      nationality: author.nationality,
    })
  }

  const handleDeleteClick = (author: Author) => {
    setDeleteAuthor(author)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteAuthor) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/authors/${deleteAuthor.id}`, { method: 'DELETE', credentials: 'include' })
      const json = await res.json()
      if (json.status) {
        setDeleteAuthor(null)
        fetchAuthors()
        setToast({ message: 'Xóa tác giả thành công', type: 'success' })
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

  // callback cho AuthorForm
  const handleSuccess = (msg: string) => {
    fetchAuthors()
    setToast({ message: msg, type: 'success' })
  }

  if (loading) return <div>Đang tải...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div className={listStyles['list-container']}>
      <div className={listStyles['list-toolbar']}>
        <button className={listStyles['list-add-btn']} onClick={() => setShowAdd(true)}>
          + Thêm tác giả
        </button>
        <input
          type="text"
          className={listStyles['list-search']}
          placeholder="Tìm kiếm tên hoặc quốc tịch..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table className={listStyles['list-table']}>
        <thead>
          <tr>
            <th className={listStyles['stt-header']}>STT</th>
            <th>Tên tác giả</th>
            <th>Năm sinh</th>
            <th>Quốc tịch</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pagedAuthors.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>
                Không có tác giả nào.
              </td>
            </tr>
          ) : (
            pagedAuthors.map((a, idx) => (
              <tr key={a.id}>
                <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td>{a.authorname}</td>
                <td>{a.birthYear || ''}</td>
                <td>{a.nationality}</td>
                <td>{a.createdAt ? a.createdAt.substring(0, 10) : ''}</td>
                <td>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Xem"
                    onClick={() => handleView(a)}
                  >
                    <FaEye color="#2563eb" />
                  </button>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Sửa"
                    onClick={() => handleEdit(a)}
                  >
                    <FaEdit color="#f59e42" />
                  </button>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Xóa"
                    onClick={() => handleDeleteClick(a)}
                  >
                    <FaTrash color="#ef4444" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Phân trang */}
      <div className={listStyles['list-pagination']}>
        <button
          className={listStyles['list-pagination-btn']}
          onClick={handlePrevPage}
          disabled={page === 1}
        >
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
        <AuthorForm
          mode="add"
          onClose={() => setShowAdd(false)}
          onSuccess={() => handleSuccess('Thêm tác giả thành công')}
        />
      )}
      {editAuthor && (
        <AuthorForm
          mode="edit"
          author={editAuthor}
          onClose={() => setEditAuthor(null)}
          onSuccess={() => handleSuccess('Cập nhật tác giả thành công')}
        />
      )}
      {deleteAuthor && (
        <DeleteAuthorModal
          authorname={deleteAuthor.authorname}
          loading={deleteLoading}
          onClose={() => setDeleteAuthor(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {viewAuthor && (
        <AuthorDetailModal
          author={viewAuthor}
          onClose={() => setViewAuthor(null)}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default function AuthorListPage() {
  return (
    <DashboardLayout>
      <AuthorListContent />
    </DashboardLayout>
  )
}
