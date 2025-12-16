export type User = {
    handle: string,
    name: string,
    email: string
    _id: string
    description?: string
    image: string
    links: string
}

export type RegisterForm = Pick<User, 'handle' | 'email' | 'name'> & {
    password: string
    password_confirmation: string
}

export type LoginForm = Pick<User, 'email'> & {
    password: string
}

export type ProfileForm = Pick<User, 'handle' | 'description'>

export type SocialNetwork = {
    id: number,
    name: string,
    url: string,
    enabled: boolean
}

export type DevTreeLink = Pick<SocialNetwork, 'id' | 'name' | 'url' | 'enabled'>

export type VisitStats = {
    handle: string
    name: string
    stats: {
        totalVisits: number
        last30Days: number
        last7Days: number
    }
}

export type MyVisitStats = {
    stats: {
        totalVisits: number
        last30Days: number
        last7Days: number
        last24Hours: number
    }
    recentVisits: Array<{
        visitedAt: string
        userAgent: string
    }>
}
