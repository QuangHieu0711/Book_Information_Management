'use client'
import React, { useState, useEffect } from 'react'
import { FaTrash } from 'react-icons/fa'
import formStyles from '../../styles/Form.module.css'

export type BorrowFormData = {
  id?: number
  userId: string
  borrowDate: string
  returnDate: string
  actualReturnDate?: string | null
  status: string
}

export type BorrowDetail = {
  id?: number // Để xử lý xóa batch khi edit
  bookId: string
  quantity: number | string
}

interface BorrowFormProps {
  mode: 'add' | 'edit'
  borrow?: BorrowFormData
  borrowDetails?: BorrowDetail[]
  onClose: () => void
  onSuccess: (message: string) => void
}

function BorrowForm({ mode, borrow, borrowDetails, onClose, onSuccess }: BorrowFormProps) {
  const [formData, setFormData] = useState<BorrowFormData>({
    userId: '',
    borrowDate: '',
    returnDate: '',
    actualReturnDate: null,
    status: 'MUON'
  })

  const [details, setDetails] = useState<BorrowDetail[]>([])
  const [oldDetails, setOldDetails] = useState<BorrowDetail[]>([]) // Lưu chi tiết cũ khi edit để xóa batch
  const [books, setBooks] = useState<{ id: number; title: string }[]>([])
  const [users, setUsers] = useState<{ id: number; name: string; role?: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detailErrors, setDetailErrors] = useState<{ bookId?: string; quantity?: string }[]>([])

  useEffect(() => {
    fetch('/api/users', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Không lấy được danh sách người dùng');
        return res.json();
      })
      .then(json => {
        if (json.status && Array.isArray(json.data)) {
          const filteredUsers = json.data
            .filter((user: any) => user.role === 'USER' || user.role === 'user')
            .map((user: any) => ({
              id: user.id ?? user.userId,
              name: user.fullName,
              role: user.role
            }));
          setUsers(filteredUsers);
        }
      })
      .catch(() => {
        setError('Không lấy được danh sách người dùng');
      });
  }, []);

  useEffect(() => {
    fetch('/api/books', { credentials: 'include' })
      .then(res => res.json())
      .then(json => {
        if (json.status) setBooks(json.data)
      })
      .catch(() => {});
  }, [])

  useEffect(() => {
    if (mode === 'edit' && borrow?.id) {
      setFormData({ ...borrow, actualReturnDate: borrow.actualReturnDate ?? null });
      if (borrowDetails && borrowDetails.length) {
        setDetails(borrowDetails.map(d => ({ ...d })));
        setOldDetails(borrowDetails.map(d => ({ ...d })));
        setDetailErrors(new Array(borrowDetails.length).fill({}));
      } else {
        fetch(`/api/borrow-return/borrow-details?borrowId=${borrow.id}`, { credentials: 'include' })
          .then(res => res.json())
          .then(json => {
            if (json.status && Array.isArray(json.data)) {
              const fetchedDetails = json.data.map((item: any) => ({
                id: item.id,
                bookId: String(item.bookId),
                quantity: item.quantity
              }));
              setDetails(fetchedDetails);
              setOldDetails(fetchedDetails);
              setDetailErrors(new Array(fetchedDetails.length).fill({}));
            } else {
              setDetails([{ bookId: '', quantity: '' }]);
              setOldDetails([]);
              setDetailErrors([{}]);
            }
          })
          .catch(() => {
            setDetails([{ bookId: '', quantity: '' }]);
            setOldDetails([]);
            setDetailErrors([{}]);
          });
      }
    } else if (mode === 'add') {
      setFormData({
        userId: '',
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate: '',
        actualReturnDate: null,
        status: 'MUON'
      })
      setDetails([{ bookId: '', quantity: '' }])
      setOldDetails([])
      setDetailErrors([{}])
    }
  }, [borrow, borrowDetails, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDetailChange = (idx: number, field: keyof BorrowDetail, value: string | number) => {
    setDetails(details =>
      details.map((d, i) => {
        if (i !== idx) return d;
        return { ...d, [field]: value };
      })
    );
    setDetailErrors(errors =>
      errors.map((err, i) => {
        if (i !== idx) return err;
        return { ...err, [field]: undefined };
      })
    );
  }

  const addDetail = () => {
    setDetails(details => [...details, { bookId: '', quantity: '' }]);
    setDetailErrors(errors => [...errors, {}]);
  }
  const removeDetail = (idx: number) => {
    const removedDetails = details.filter((_, i) => i !== idx);
    setDetails(removedDetails);
    setDetailErrors(errors => errors.filter((_, i) => i !== idx));
  }

  const validateDetails = () => {
    let valid = true;
    const errors: { bookId?: string; quantity?: string }[] = [];
    details.forEach((detail, idx) => {
      const err: { bookId?: string; quantity?: string } = {};
      if (!detail.bookId) {
        err.bookId = 'Vui lòng chọn sách';
        valid = false;
      }
      if (
        String(detail.quantity) === '' ||
        detail.quantity === undefined ||
        isNaN(Number(detail.quantity)) ||
        Number(detail.quantity) < 1
      ) {
        err.quantity = 'Số lượng phải ≥ 1';
        valid = false;
      }
      errors[idx] = err;
    });
    setDetailErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!validateDetails()) return;

    setLoading(true)
    try {
      let borrowBody = {
        borrowDate: formData.borrowDate,
        returnDate: formData.returnDate,
        status: formData.status,
        userId: parseInt(formData.userId),
        actualReturnDate: mode === 'add' ? null : formData.actualReturnDate ?? null
      }

      const borrowApiUrl = mode === 'add'
        ? 'api/borrow-return/borrows'
        : `api/borrow-return/borrows/${formData.id}`;
      const borrowApiMethod = mode === 'add' ? 'POST' : 'PUT';

      const resBorrow = await fetch(borrowApiUrl, {
        method: borrowApiMethod,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(borrowBody)
      });
      const borrowResJson = await resBorrow.json();

      if (!borrowResJson.status) {
        setError(borrowResJson.userMessage || 'Lỗi khi thêm/cập nhật phiếu mượn');
        setLoading(false);
        return;
      }

      const borrowId =
        (mode === 'add'
          ? (
              borrowResJson.data?.id ??
              borrowResJson.data?.borrowId ??
              borrowResJson.borrowId ??
              (typeof borrowResJson.data === 'number' ? borrowResJson.data : undefined)
            )
          : formData.id);

      if (!borrowId) {
        setError('Không lấy được mã phiếu mượn!');
        setLoading(false);
        return;
      }

      // Khi sửa, xóa hết chi tiết cũ trước khi thêm mới (batch/delete)
      if (mode === 'edit' && oldDetails.length > 0) {
        const oldDetailIds = oldDetails
          .filter(d => !!d.id)
          .map(d => d.id as number);
        if (oldDetailIds.length > 0) {
          const resDelete = await fetch('/api/borrow-return/borrow-details/batch/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(oldDetailIds),
          });
          const deleteJson = await resDelete.json();
          if (!deleteJson.status) {
            setError(deleteJson.userMessage || 'Lỗi khi xóa chi tiết cũ phiếu mượn');
            setLoading(false);
            return;
          }
        }
      }

      const detailsBody = details.map(detail => ({
        borrowId: borrowId,
        bookId: parseInt(detail.bookId),
        quantity: Number(detail.quantity)
      }));

      const detailsApiUrl = 'api/borrow-return/borrow-details/batch';
      const resDetails = await fetch(detailsApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(detailsBody)
      });
      const detailsResJson = await resDetails.json();

      if (!detailsResJson.status) {
        setError(detailsResJson.userMessage || 'Lỗi khi thêm/cập nhật chi tiết phiếu mượn');
        setLoading(false);
        return;
      }

      onSuccess(mode === 'add' ? 'Thêm phiếu mượn thành công' : 'Cập nhật phiếu mượn thành công');
      onClose();
    } catch (err) {
      setError('Lỗi kết nối server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={formStyles['modal-overlay']}>
      <div className={formStyles['modal-content']} style={{ maxWidth: 600 }}>
        <div className={formStyles['modal-title-bar']}>
          <div className={formStyles['modal-title']}>{mode === 'add' ? 'THÊM PHIẾU MƯỢN' : 'SỬA PHIẾU MƯỢN'}</div>
          <button type='button' className={formStyles['close-btn']} onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className={formStyles['form']}>
          {error && <div className={formStyles['error-message']}>{error}</div>}

          <div className={formStyles['form-section']}>
            <h3 style={{ marginBottom: 8 }}>Thông tin phiếu mượn</h3>
            <div className={formStyles['form-grid']}>
              <div className={formStyles['form-group']}>
                <label htmlFor='userId' className={formStyles['form-label']}>
                  Người mượn:
                </label>
                <select
                  id='userId'
                  name='userId'
                  value={formData.userId}
                  onChange={handleChange}
                  required
                  className={formStyles['input']}
                >
                  <option value=''>Chọn người mượn</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id.toString()}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={formStyles['form-group']}>
                <label htmlFor='borrowDate' className={formStyles['form-label']}>
                  Ngày mượn:
                </label>
                <input
                  type='date'
                  id='borrowDate'
                  name='borrowDate'
                  value={formData.borrowDate}
                  onChange={handleChange}
                  required
                  className={formStyles['input']}
                />
              </div>
              <div className={formStyles['form-group']}>
                <label htmlFor='returnDate' className={formStyles['form-label']}>
                  Ngày hẹn trả:
                </label>
                <input
                  type='date'
                  id='returnDate'
                  name='returnDate'
                  value={formData.returnDate}
                  onChange={handleChange}
                  className={formStyles['input']}
                />
              </div>
              {mode === 'edit' && (
                <div className={formStyles['form-group']}>
                  <label htmlFor='actualReturnDate' className={formStyles['form-label']}>
                    Ngày trả thực tế:
                  </label>
                  <input
                    type='date'
                    id='actualReturnDate'
                    name='actualReturnDate'
                    value={formData.actualReturnDate ?? ''}
                    onChange={handleChange}
                    className={formStyles['input']}
                  />
                </div>
              )}
              <div className={formStyles['form-group']}>
                <label htmlFor='status' className={formStyles['form-label']}>
                  Trạng thái:
                </label>
                <select
                  id='status'
                  name='status'
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className={formStyles['input']}
                >
                  <option value='MUON'>MƯỢN</option>
                  <option value='DA TRA'>ĐÃ TRẢ</option>
                </select>
              </div>
            </div>
          </div>

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1.5px solid #e0e0e0' }} />

          <div className={formStyles['form-section']} style={{ marginTop: 0 }}>
            <h3 style={{ marginBottom: 8 }}>Chi tiết phiếu mượn</h3>
            <table className={formStyles['form-detail-table']} style={{ width: '100%', marginBottom: 10 }}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sách</th>
                  <th>Số lượng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {details.map((detail, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                    <td>
                      <select
                        value={detail.bookId}
                        onChange={e => handleDetailChange(idx, 'bookId', e.target.value)}
                        className={formStyles['input']}
                        required
                      >
                        <option value=''>Chọn sách</option>
                        {books.map(book => (
                          <option key={book.id} value={book.id.toString()}>
                            {book.title}
                          </option>
                        ))}
                      </select>
                      {detailErrors[idx]?.bookId && (
                        <div className={formStyles['error-message']}>{detailErrors[idx].bookId}</div>
                      )}
                    </td>
                    <td>
                      <input
                        type='number'
                        min={1}
                        value={detail.quantity}
                        onChange={e => handleDetailChange(idx, 'quantity', e.target.value)}
                        className={formStyles['input']}
                        required
                        style={{ width: 80 }}
                      />
                      {detailErrors[idx]?.quantity && (
                        <div className={formStyles['error-message']}>{detailErrors[idx].quantity}</div>
                      )}
                    </td>
                    <td>
                      {details.length > 1 && (
                        <button
                          type='button'
                          onClick={() => removeDetail(idx)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
                          title='Xóa sách'
                        >
                          <FaTrash color='#ef4444' size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type='button' onClick={addDetail} className={formStyles['btn-confirm']} style={{ marginBottom: 8 }}>
              + Thêm sách
            </button>
          </div>

          <div className={formStyles['form-footer']}>
            <button type='button' onClick={onClose} className={formStyles['btn-cancel']}>
              Hủy bỏ
            </button>
            <button type='submit' disabled={loading} className={formStyles['btn-confirm']}>
              {loading ? 'Đang lưu...' : mode === 'add' ? 'Xác nhận' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BorrowForm
