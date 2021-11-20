import React, {useState, useEffect} from 'react';

const errorPage = () => {
    const [error, setError] = useState(null)
    useEffect(() => {
        let errorQuery = window.location.search.slice(7);
        if (errorQuery === 'ORDER_NOT_FOUND') setError('هیچ سفارشی یافت نشد!');
        else if (errorQuery === 'ORDER_IS_EXPIRED') setError('لینک سفارش منقضی شده است.');
    }, [])
    return (
        <div className="text-center mt-16 error size-20">
            {error}
        </div>
    );
}
 
export default errorPage;