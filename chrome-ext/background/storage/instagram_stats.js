class InstagramStats extends Collection {

  constructor(instagram) {
    super()

    this.available_keys = ['follower_count', 'following_count', 'user', 'current', 'misc']

    this.instagram = instagram
  }

  async updateValues() {
    if (!instagram.is_logged_in) {
      throw new Error(`Instagram not logged in`)
    }

    const { user } = await this.instagram.callMethod('get_user_info', this.instagram.user.pk)
    const { items } = await this.instagram.callMethod('get_user_feed', this.instagram.user.pk)
    const average_like_count = !items.length ? 0 : (items.reduce((sum, item) => sum + item.like_count, 0) / items.length)

    user.average_like_count = Math.floor(average_like_count)

    await this.save('user', user)
    await this.set('current', user)

    await this.save('follower_count', { followers: user.follower_count })
    await this.save('following_count', { followers: user.following_count })

    return user
  }

  async getInfo() {
    const { like } = await this.instagram.history.get('like')
    const { follow } = await this.instagram.history.get('follow')

    const { follower_count } = await this.get('follower_count')
    const { following_count } = await this.get('following_count')

    const { current } = await this.get('current')

    return {
      likes: like.length,
      follows: follow.length,

      follower_count: current.follower_count,
      following_count: current.following_count,
      average_like_count: current.average_like_count,

      full: {
        current,

        like,
        follow,

        follower_count,
        following_count,
      }
    }
  }

}
