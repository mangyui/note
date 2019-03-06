import request from '@/utils/request'

export function getNoteList() {
  return request({
    url: '/data/notes/list.json',
    method: 'get'
  })
}
