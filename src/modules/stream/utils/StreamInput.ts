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
