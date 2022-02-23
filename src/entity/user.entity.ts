import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { UserPermission, UserStatus } from '../user/dtos/type';
@Entity('tb_user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '用户id' })
  id: string;
  @Column({ type: 'varchar', length: 25, unique: true, comment: '用户名' })
  username: string;
  @Column({ type: 'varchar', length: 60, comment: '加密过的密码' })
  password: string;
  @Column({ type: 'varchar', length: 20, nullable: true, comment: '昵称' })
  nickname: string;
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
    comment: '邮箱',
  })
  email: string;
  @Column({ type: 'varchar', length: 255, nullable: true, comment: '头像' })
  avatar: string;
  @Column({
    type: 'boolean',
    default: true,
    comment: '是否激活',
  })
  active: boolean;
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.normal,
    comment: '是否激活',
  })
  status: UserStatus; //默认 正常
  @Column({
    type: 'enum',
    enum: UserPermission,
    default: UserPermission.user,
    comment: '用户状态',
  })
  permissions: UserPermission; //默认 正常权限
  @CreateDateColumn({
    type: 'timestamp',
    name: 'create_time',
    comment: '创建时间',
  })
  createTime: string;
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_time',
    comment: '更新时间',
  })
  updateTime: string;
}
