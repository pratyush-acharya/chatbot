import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


const TableSkeletonComponent = () => {
    return (
        <>
            <Stack spacing={1}>

                <Skeleton variant="rectangular" width={1500} height={40} />
                <Skeleton variant="rectangular" width={1500} height={20} />
                <Skeleton variant="rectangular" width={1500} height={20} />
                <Skeleton variant="rectangular" width={1500} height={20} />
                <Skeleton variant="rectangular" width={1500} height={20} />
            </Stack>
        </>
    )
}

export default TableSkeletonComponent