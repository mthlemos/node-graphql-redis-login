import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserModel extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;
}