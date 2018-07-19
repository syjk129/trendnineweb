import { Categories } from "./categories";

interface MarketingImage {
    smallImage: string;
    originalImage: string;
    width: number;
    height: number;
}

export enum MarketingImages {
    CAROUSEL1,
    CAROUSEL2,
    CAROUSEL3,
    HALF1,
    HALF2,
    HALF3,
    HALF4,
    FULL1,
}

// TODO: This should come from the service later
export function getMarketingImage(imageType: MarketingImages | Categories): MarketingImage {
    switch (imageType) {
        case MarketingImages.CAROUSEL1:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/036a3cb2b88f4ed59f8eb1b8be4aac4f.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/836056f2d11a42629be53feb62d985a8.png",
                width: 1440,
                height: 500,
            };
        case MarketingImages.CAROUSEL2:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/2db173e8a12647d8bffa362cde44c980.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/33ef89432bd045b08f8381c78426dc05.png",
                width: 1440,
                height: 500,
            };
        case MarketingImages.CAROUSEL3:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/b5e3b2ed03f94c62bb0218af8011f543.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/60d9c8faba914c269d3d54cdb85d5bf2.png",
                width: 1440,
                height: 500,
            };
        case MarketingImages.HALF1:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/640f267d69b7418db22237201d0880f0.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/83e74cb3ef4f40ceb7cc889cf767e11b.png",
                width: 660,
                height: 440,
            };
        case MarketingImages.HALF2:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/591c486a12de49f88466ac60a5396857.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/265dd5e63c0e4b938e4c87f59262bcc6.png",
                width: 660,
                height: 440,
            };
        case MarketingImages.HALF3:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/447492a5576b4ab1b0ea9f8e0a94ea9b.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/dbd56040647e476c8ee1a77a67e30782.png",
                width: 660,
                height: 440,
            };
        case MarketingImages.HALF4:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/c48810db924a408ea8d46f865d627ce0.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/e853fa9c1478472db48b437a59020f8c.png",
                width: 660,
                height: 440,
            };
        case Categories.SKIRTS:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/1a9364d0c87f40babf144d0b260aea90.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/efc6d9d1e6054d79b4d3fc317c495385.png",
                width: 200,
                height: 200,
            };
        case Categories.SUNGLASSES:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/52e5a635c64245169f797e39eb158355.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/57d88fc429e84c10887759677b9566a8.png",
                width: 200,
                height: 200,
            };
        case Categories.SWIMWEAR:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/ccdd1456dfce428a863112d4c13eb29d.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/4c6904756bfd4864b1dd3b58942081ac.png",
                width: 200,
                height: 200,
            };
        case Categories.BAGS:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/76530e07f00e43afafcfbacdfed0a990.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/c60cf1f492c94cefaaa4428f9f5eacf1.png",
                width: 200,
                height: 200,
            };
        case Categories.DENIM:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/bfa7f7bb818f47bcb9754a82f06270f7.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/16ee6fba209a4207ae00ecd4703cacdf.png",
                width: 200,
                height: 200,
            };
        case Categories.DRESSES:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/099abbc1cf1b4d6e8b94bc17a008c67d.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/902c8a0252e5404d94822435fe5ca702.png",
                width: 200,
                height: 200,
            };
        case Categories.HATS:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/342f6defca424fce8d4385b6ff26e6a2.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/6254be740ca0485d97965421de36a860.png",
                width: 200,
                height: 200,
            };
        case Categories.JACKETS:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/60b4aed8f9584f3d881f59a3c81bceb8.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/3a04c1839be74eab88ed022951157583.png",
                width: 200,
                height: 200,
            };
        case Categories.PANTS:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/837ecdb8591b42669520c8cf4f6c898f.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/9d6fbd27d5164f45b1c1cda440d601af.png",
                width: 200,
                height: 200,
            };
        case Categories.SHOES:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/af0843938b084b819cb978365f956846.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/0f49cc7246474af7a75230151d64775a.png",
                width: 200,
                height: 200,
            };
        case Categories.SHORTS:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/7d6da72a858d409d9687da490b28dd3e.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/302eaf36ce2547b69f92161d33469d7b.png",
                width: 200,
                height: 200,
            };
        case MarketingImages.FULL1:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/f959bbb155584c4caf6bc30c482db139.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/39208a5fdb524cec8523226ab77be334.png",
                width: 1440,
                height: 420,
            };
    }
}
