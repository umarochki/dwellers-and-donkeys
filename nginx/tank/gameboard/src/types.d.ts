// types.d.ts

interface ObjectOptions {
    id?: number,
    type: string,
    sprite: string,
    texture?: import('pixi.js-legacy').Texture,
    xy: [number, number],
    wh?: [number, number],
    name?: string,
} // ObjectOptions

interface LoaderRequest { 
    resources: { 
        name: string,
        url: string
    }[], 
    callback: (loader: import('pixi.js-legacy').Loader, resources: Partial<Record<string, import('pixi.js-legacy').LoaderResource>>) => any
}

type Size = {
    width: number,
    height: number
}

type int = number;
type double = number;
type Vec2i = [int, int];
type Vec2f = [double, double];
type Vec3i = [int, int, int];
type Vec3f = [double, double, double];
