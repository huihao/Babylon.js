/* eslint-disable @typescript-eslint/naming-convention */
import type { IGLTFLoaderExtension } from "../glTFLoaderExtension";
import { GLTFLoader } from "../glTFLoader";
import type { ITexture } from "../glTFLoaderInterfaces";
import type { BaseTexture } from "core/Materials/Textures/baseTexture";
import type { Nullable } from "core/types";
import type { IEXTTextureWebP } from "babylonjs-gltf2interface";
import { LoadExtensionAsync } from "./BaseLoaderExtension";
import { ArrayItem } from "../BaseLoader";

const NAME = "EXT_texture_webp";

/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/EXT_texture_webp/)
 */
export class EXT_texture_webp implements IGLTFLoaderExtension {
    /** The name of this extension. */
    public readonly name = NAME;

    /** Defines whether this extension is enabled. */
    public enabled: boolean;

    private _loader: GLTFLoader;

    /**
     * @param loader
     * @hidden
     */
    constructor(loader: GLTFLoader) {
        this._loader = loader;
        this.enabled = loader.isExtensionUsed(NAME);
    }

    /** @hidden */
    public dispose() {
        (this._loader as any) = null;
    }

    /**
     * @param context
     * @param texture
     * @param assign
     * @hidden
     */
    public _loadTextureAsync(context: string, texture: ITexture, assign: (babylonTexture: BaseTexture) => void): Nullable<Promise<BaseTexture>> {
        return LoadExtensionAsync<IEXTTextureWebP, BaseTexture>(context, texture, this.name, (extensionContext, extension) => {
            const sampler = texture.sampler == undefined ? GLTFLoader.DefaultSampler : ArrayItem.Get(`${context}/sampler`, this._loader.gltf.samplers, texture.sampler);
            const image = ArrayItem.Get(`${extensionContext}/source`, this._loader.gltf.images, extension.source);
            return this._loader._createTextureAsync(
                context,
                sampler,
                image,
                (babylonTexture) => {
                    assign(babylonTexture);
                },
                undefined,
                !texture._textureInfo.nonColorData
            );
        });
    }
}

GLTFLoader.RegisterExtension(NAME, (loader) => new EXT_texture_webp(loader as GLTFLoader));
