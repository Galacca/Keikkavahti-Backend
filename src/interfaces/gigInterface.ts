import { RowDataPacket } from "mysql2"

export interface Gig extends RowDataPacket {
  id: number
  link: string
  date: string
  time: string
  venue: string
  bands: string
  addinfo: string
  interestedUsers: Array<string>
  AttendingUsers: Array<string>
}