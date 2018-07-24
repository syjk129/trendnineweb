interface MarketingImage {
    smallImage: string;
    originalImage: string;
    width: number;
    height: number;
}

export enum DiscoverMarketingImages {
    WELCOME,
    CAROUSEL1,
    CAROUSEL2,
    CAROUSEL3,
    CAROUSEL4,
}

export function getMobileMarketingImage(imageType: DiscoverMarketingImages): MarketingImage {
    switch (imageType) {
        case DiscoverMarketingImages.WELCOME:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/e4c59e33f9c34bf492ce5b9584a7cf07.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/b8c9a74aba0544d48a67c62db260269b.jpg",
                width: 375,
                height: 250,
            };
        case DiscoverMarketingImages.CAROUSEL1:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/c95afab81f1740dfa2e872dd118a355e.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/29e344d04b6c42edab05b73fe5726651.jpg",
                width: 375,
                height: 250,
            };
        case DiscoverMarketingImages.CAROUSEL2:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/efb161dcb3a849dd8939aad58e2e16b8.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/621eac3a2ab149cd97626a290f313480.jpg",
                width: 375,
                height: 250,
            };
        case DiscoverMarketingImages.CAROUSEL3:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/a3820370f1b64178ac73522d5313b006.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/8bd69256437d4520bda029de2364f8c4.jpg",
                width: 375,
                height: 250,
            };
        case DiscoverMarketingImages.CAROUSEL4:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/53cafb3c90284d7096fa5a5af34262fd.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/75dbe545040b476ca8fb567d316db792.jpg",
                width: 375,
                height: 250,
            };
    }
}

export function getDesktopMarketingImage(imageType: DiscoverMarketingImages): MarketingImage {
    switch (imageType) {
        case DiscoverMarketingImages.WELCOME:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/5871f782a00343e18c46fd50024bd079.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/e92326f85a6f4fc7919d4fad8171c86d.png",
                width: 1440,
                height: 400,
            };
        case DiscoverMarketingImages.CAROUSEL1:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/6fc81b38ca304b519e3a66653862def1.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/6106c4d5f0d24982acab841b021fd8cb.png",
                width: 1440,
                height: 400,
            };
        case DiscoverMarketingImages.CAROUSEL2:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/7b27941429994db592b3357df9319344.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/9387f06e1362497699039634db29c137.png",
                width: 1440,
                height: 400,
            };
        case DiscoverMarketingImages.CAROUSEL3:
            return {
                smallImage: "https://trendnine.s3.amazonaws.com/images/2018/07/9c095791f029445ea68924ba0659bff7.png",
                originalImage: "https://trendnine.s3.amazonaws.com/images/2018/07/b6854c4d0402430e9da422c817252f3e.png",
                width: 1440,
                height: 400,
            };
    }
}
