import { Stream } from "./Stream"
import { Field, ID, ObjectType } from "type-graphql"
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm"

@ObjectType({ description: "User" })
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Field(() => [Stream], { nullable: true })
  @OneToMany(() => Stream, (stream: Stream) => stream.user, {
    nullable: true,
  })
  streams: Stream[]
}
