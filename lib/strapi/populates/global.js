export const globalPopulate = {
    header: {
        populate: {
            menu: { populate: "*" },
            socials: { populate: "*" },
            imageWhatsapp: true,
            imageWpBlack: true,
            icon: true,
            iconBlack: true,
            secondMenu: {
                populate: {
                    links: { populate: "*" },
                },
            },
        },
    },
    footer: {
        populate: {
            linkBlock: { populate: "*" },
        },
    },
};