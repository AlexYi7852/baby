import * as API from './API'

export async function login (params) {
  const res = await API.post(`user/login`, params)
  return res
}

export async function getUserInfo (params) {
  const res = await API.post(`user/info/inquiry`, params)
  return res
}

export async function logout () {
  const res = await API.post(`user/logout`, null)
  return res
}

export async function authentication (params) {
  const res = await API.post(`user/twoFactorAuthentication`, params)
  return res
}

export async function getPayrollList () {
  const res = await API.post(`user/unclaimedPayrollList`)
  return res
}

export async function payrollConfirm (params) {
  const res = await API.post(`user/payrollConfirm`, params)
  return res
}

export async function bankCardInfoInquiry (params) {
  const res = await API.post(`user/bankCardInfoInquiry`, params)
  return res
}

export async function bankCardBind (params) {
  const res = await API.post(`user/bankCardBind`, params)
  return res
}

export async function getCardList () {
  const res = await API.post(`user/bankCardInquiry`, null)
  return res
}

export async function bankCardUnBind (params) {
  const res = await API.post(`user/bankCardUnBind`, params)
  return res
}

export async function tradeRecords (params) {
  const res = await API.post(`user/tradeRecords`, params)
  return res
}

export async function userSalaryGrantExtList (params) {
  const res = await API.post(`user/userSalaryGrantExtList`, params)
  return res
}

export async function accountList (params) {
  const res = await API.post(`user/accountList`, params)
  return res
}

export async function salaryWithdraw (params) {
  const res = await API.post(`user/salaryWithdraw`, params)
  return res
}

export async function queryBorrowingIndex () {
  const res = await API.post(`user/borrowing/index/query`, null)
  return res
}

export async function querBorrowingRecord () {
  const res = await API.post(`user/borrowing/record/query`, null)
  return res
}

export async function querBorrowingCondition () {
  const res = await API.post(`user/borrowing/condition/query`, null)
  return res
}

export async function querBorrowingService () {
  const res = await API.post(`user/borrowing/service/query`, null)
  return res
}

export async function confirmBorrowing (params) {
  const res = await API.post(`user/borrowing/confirm`, params)
  return res
}