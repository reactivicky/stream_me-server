import { EditStreamInput, StreamInput } from "./utils/StreamInput"
import { MyContext } from "./../../types/MyContext"
import { Stream } from "./../../entity/Stream"
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql"

@Resolver(() => Stream)
export default class StreamResolver {
  @Authorized()
  @Query(() => Stream, { nullable: true })
  async stream(
    @Arg("streamId") streamId: number,
    @Ctx() ctx: MyContext
  ): Promise<Stream | undefined> {
    const stream = await Stream.findOne(
      {
        id: streamId,
        user: ctx.req.session!.userId,
      },
      { relations: ["user"] }
    )
    return stream
  }

  @Authorized()
  @Query(() => [Stream])
  async streams(@Ctx() ctx: MyContext): Promise<Stream[] | null> {
    if (!ctx.req.session!.userId) return null
    const streamArr = await Stream.find({
      where: { user: ctx.req.session!.userId },
    })
    return streamArr
  }

  @Authorized()
  @Mutation(() => Stream)
  async addStream(
    @Arg("data") { title, description, url }: StreamInput,
    @Ctx() ctx: MyContext
  ): Promise<Stream> {
    const stream = Stream.create({
      title,
      description,
      url,
      user: ctx.req.session.userId,
    }).save()

    return stream
  }

  @Authorized()
  @Mutation(() => Stream)
  async editStream(
    @Arg("streamId") streamId: number,
    @Arg("data") data: EditStreamInput
  ): Promise<Stream | undefined> {
    const stream = await Stream.findOne({ where: { id: streamId } })
    if (!stream) return undefined
    const updatedstream = { ...stream, ...data }
    await Stream.update({ id: streamId }, updatedstream)
    return Stream.findOne({ where: { id: streamId } })
  }

  @Authorized()
  @Mutation(() => Boolean)
  async deleteStream(@Arg("streamId") streamId: number) {
    await Stream.delete({ id: streamId })
    return true
  }
}
