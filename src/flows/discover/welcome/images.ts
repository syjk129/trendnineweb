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
