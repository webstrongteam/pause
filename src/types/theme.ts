export interface Theme {
	primary: string
	secondary: string
	third: string
	progress: string
}

export type ColorType = 'primary' | 'secondary' | 'third' | 'progress'

export type Color = {
	color: string
	requiredLevel: number
}
