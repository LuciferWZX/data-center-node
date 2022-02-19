export enum UserStatus {
  normal = 0, //正常
  forbidden = 1, //被禁用
  deleted = 2, //被删除
}
export enum UserPermission {
  poor = -1, //基本无权限
  user = 0, //正常权限
  admin = 1, //管理员权限
  vip = 2, //最高权限
}
