// types.d.ts

interface ObjectOptions {
    id?: number,
    type: string,
    sprite: string,
    texture?: PIXI.Texture,
    xy: [number, number],
    wh?: [number, number],
    name?: string,
} // ObjectOptions

interface LoaderRequest { 
    resources: { 
        name: string,
        url: string
    }[], 
    callback: (loader: PIXI.Loader, resources: Partial<Record<string, PIXI.LoaderResource>>) => any
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
