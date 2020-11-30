import { Field, InputType } from "type-graphql"

@InputType()
export class StreamInput {
  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field()
  url: string
}

@InputType()
export class EditStreamInput {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  url?: string
}
