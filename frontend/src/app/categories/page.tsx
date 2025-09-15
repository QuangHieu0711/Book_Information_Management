'use client'
import DashboardLayout from '@/components/Layout'
import React, { useEffect, useState } from 'react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import listStyles from '../../styles/List.module.css'
import deleteModalStyles from '../../styles/DeleteModal.module.css'
import CategoryForm, { CategoryEditForm } from './CategoryForm'
import CategoryDetailModal from './CategoryDetailModal'
import Toast from '../../components/Toast'

function DeleteCategoryModal({
  categoryname,
  onClose,
  onConfirm,
  loading,
}: {
  categoryname: string
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
          Bạn có chắc chắn muốn xóa thể loại <b>{categoryname}</b>?
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

type Category = {
  id: number
  categoryname: string
  createdAt: string
}

const PAGE_SIZE = 10

function CategoryListContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // State cho modal form
  const [showAdd, setShowAdd] = useState(false)
  const [editCategory, setEditCategory] = useState<CategoryEditForm | null>(null)
  const [viewCategory, setViewCategory] = useState<Category | null>(null)

  // State cho modal xóa
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Thông báo thành công
  const [toast, setToast] = useState<{message: string, type?: 'success'|'error'}|null>(null)

  // Lấy danh sách category
  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/categories', { credentials: 'include' })
      const json = await res.json()
      if (json.status && Array.isArray(json.data)) {
        setCategories(json.data)
      } else {
        setError(json.userMessage || 'Lỗi lấy danh sách thể loại')
      }
    } catch (err) {
      setError('Không thể kết nối tới server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Sắp xếp theo thời gian tạo (createdAt) mới nhất lên đầu
  const sortedCategories = [...categories].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Filter categories by categoryname
  const filtered = sortedCategories.filter(c =>
    c.categoryname.toLowerCase().includes(search.toLowerCase())
  )

  // Paging
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pagedCategories = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleView = (category: Category) => setViewCategory(category)
  const handleEdit = (category: Category) =>
    setEditCategory({ id: category.id, categoryname: category.categoryname })
  const handleDeleteClick = (category: Category) => setDeleteCategory(category)

  const handleDeleteConfirm = async () => {
    if (!deleteCategory) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/categories/${deleteCategory.id}`, { method: 'DELETE', credentials: 'include' })
      const json = await res.json()
      if (json.status) {
        setDeleteCategory(null)
        fetchCategories()
        setToast({ message: 'Xóa thể loại thành công', type: 'success' })
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

  // callback cho CategoryForm
  const handleSuccess = (msg: string) => {
    fetchCategories()
    setToast({ message: msg, type: 'success' })
  }

  if (loading) return <div>Đang tải...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div className={listStyles['list-container']}>
      <div className={listStyles['list-toolbar']}>
        <button className={listStyles['list-add-btn']} onClick={() => setShowAdd(true)}>
          + Thêm thể loại
        </button>
        <input
          type="text"
          className={listStyles['list-search']}
          placeholder="Tìm kiếm tên thể loại..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table className={listStyles['list-table']}>
        <thead>
          <tr>
            <th className={listStyles['stt-header']}>STT</th>
            <th>Tên thể loại</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pagedCategories.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: 24 }}>
                Không có thể loại nào.
              </td>
            </tr>
          ) : (
            pagedCategories.map((c, idx) => (
              <tr key={c.id}>
                <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td>{c.categoryname}</td>
                <td>{c.createdAt ? c.createdAt.substring(0, 10) : ''}</td>
                <td>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Xem"
                    onClick={() => handleView(c)}
                  >
                    <FaEye color="#2563eb" />
                  </button>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Sửa"
                    onClick={() => handleEdit(c)}
                  >
                    <FaEdit color="#f59e42" />
                  </button>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Xóa"
                    onClick={() => handleDeleteClick(c)}
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
      {/* Modal form thêm */}
      {showAdd && (
        <CategoryForm
          mode="add"
          onClose={() => setShowAdd(false)}
          onSuccess={() => handleSuccess('Thêm thể loại thành công')}
        />
      )}
      {/* Modal form sửa */}
      {editCategory && (
        <CategoryForm
          mode="edit"
          category={editCategory}
          onClose={() => setEditCategory(null)}
          onSuccess={() => handleSuccess('Cập nhật thể loại thành công')}
        />
      )}
      {/* Modal xóa */}
      {deleteCategory && (
        <DeleteCategoryModal
          categoryname={deleteCategory.categoryname}
          loading={deleteLoading}
          onClose={() => setDeleteCategory(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {/* Modal xem chi tiết */}
      {viewCategory && (
        <CategoryDetailModal
          category={viewCategory}
          onClose={() => setViewCategory(null)}
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

export default function CategoryListPage() {
  return (
    <DashboardLayout>
      <CategoryListContent />
    </DashboardLayout>
  )
}
