'use client'
import DashboardLayout from '@/components/Layout'
import React, { useEffect, useState } from 'react'
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'
import listStyles from '../../styles/List.module.css'
import deleteModalStyles from '../../styles/DeleteModal.module.css'
import UserForm, { UserEditForm } from './UserForm'
import UserDetailModal from './UserDetailModal'
import Toast from '../../components/Toast'

function DeleteUserModal({
  username,
  onClose,
  onConfirm,
  loading,
}: {
  username: string
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
          Bạn có chắc chắn muốn xóa tài khoản <b>{username}</b>?
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

type User = {
  id: number
  username: string
  role: string
  fullName: string
  createdAt: string
}

const PAGE_SIZE = 10

function UserListContent() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // State cho modal form
  const [showAdd, setShowAdd] = useState(false)
  const [editUser, setEditUser] = useState<UserEditForm | null>(null)
  const [viewUser, setViewUser] = useState<User | null>(null)

  // State cho modal xóa
  const [deleteUser, setDeleteUser] = useState<User | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Thông báo thành công
  const [toast, setToast] = useState<{message: string, type?: 'success'|'error'}|null>(null)

  // Lấy danh sách user
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/users', { credentials: 'include' })
      const json = await res.json()
      if (json.status && Array.isArray(json.data)) {
        setUsers(json.data)
      } else {
        setError(json.userMessage || 'Lỗi lấy danh sách người dùng')
      }
    } catch (err) {
      setError('Không thể kết nối tới server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Sắp xếp theo thời gian tạo (createdAt) mới nhất lên đầu
  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Filter users by search
  const filtered = sortedUsers.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase())
  )

  // Paging
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pagedUsers = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleView = (user: User) => {
    setViewUser(user)
  }

  const handleEdit = (user: User) => {
    setEditUser({ id: user.id, username: user.username, role: user.role, fullName: user.fullName })
  }

  const handleDeleteClick = (user: User) => {
    setDeleteUser(user)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteUser) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/users/${deleteUser.id}`, { method: 'DELETE', credentials: 'include' })
      const json = await res.json()
      if (json.status) {
        setDeleteUser(null)
        fetchUsers()
        setToast({ message: 'Xóa người dùng thành công', type: 'success' })
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

  // callback cho UserForm
  const handleSuccess = (msg: string) => {
    fetchUsers()
    setToast({ message: msg, type: 'success' })
  }

  if (loading) return <div>Đang tải...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return (
    <div className={listStyles['list-container']}>
      <div className={listStyles['list-toolbar']}>
        {/* Nút thêm bên trái */}
        <button className={listStyles['list-add-btn']} onClick={() => setShowAdd(true)}>
          + Thêm người dùng
        </button>
        {/* Tìm kiếm */}
        <input
          type="text"
          className={listStyles['list-search']}
          placeholder="Tìm kiếm tên đăng nhập..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table className={listStyles['list-table']}>
        <thead>
          <tr>
            <th className={listStyles['stt-header']}>STT</th>
            <th>Tên đăng nhập</th>
            <th>Vai trò</th>
            <th>Họ tên</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pagedUsers.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: 24 }}>
                Không có người dùng nào.
              </td>
            </tr>
          ) : (
            pagedUsers.map((u, idx) => (
              <tr key={u.id}>
                <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                <td>{u.username}</td>
                <td>{u.role === 'ADMIN' ? 'ADMIN' : 'USER'}</td>
                <td>{u.fullName}</td>
                <td>{u.createdAt ? u.createdAt.substring(0, 10) : ''}</td>
                <td>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Xem"
                    onClick={() => handleView(u)}
                  >
                    <FaEye color="#2563eb" />
                  </button>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Sửa"
                    onClick={() => handleEdit(u)}
                  >
                    <FaEdit color="#f59e42" />
                  </button>
                  <button
                    className={listStyles['list-action-btn']}
                    title="Xóa"
                    onClick={() => handleDeleteClick(u)}
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
        <UserForm
          mode="add"
          onClose={() => setShowAdd(false)}
          onSuccess={() => handleSuccess('Thêm người dùng thành công')}
        />
      )}
      {editUser && (
        <UserForm
          mode="edit"
          user={editUser}
          onClose={() => setEditUser(null)}
          onSuccess={() => handleSuccess('Cập nhật người dùng thành công')}
        />
      )}
      {deleteUser && (
        <DeleteUserModal
          username={deleteUser.username}
          loading={deleteLoading}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      {viewUser && (
        <UserDetailModal
          user={viewUser}
          onClose={() => setViewUser(null)}
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

export default function UserListPage() {
  return (
    <DashboardLayout>
      <UserListContent />
    </DashboardLayout>
  )
}
