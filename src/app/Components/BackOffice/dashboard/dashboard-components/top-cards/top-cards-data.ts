export interface topcard {
    bgcolor: string,
    icon: string,
    title: string,
    subtitle: string
}

export const topcards: topcard[] = [

    {
        bgcolor: 'warning',
        icon: 'bi-person',
        title: 'Total Users',
        subtitle: '0'
    },
    {
        bgcolor: 'success',
        icon: 'bi bi-car-front',
        title: 'Total Trips',
        subtitle: '0'
    },
    {
        bgcolor: 'danger',
        icon: "bi bi-pin-map",
        title: 'Total Carpools',
        subtitle: '0'
    },
    {
        bgcolor: 'info',
        icon: 'bi bi-box-seam', 
        title: 'Total Parcels', 
        subtitle: '0'
    },

] 