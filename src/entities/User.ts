import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class UserModel extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        unique: true
    })
    email: string;

    @Column()
    password: string;
}