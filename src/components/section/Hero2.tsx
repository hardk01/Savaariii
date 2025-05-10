'use client'
import Link from 'next/link'

export default function Hero3() {
	return (
		<>
			<div className="page-header-2 pt-30 background-body">
				<div className="custom-container position-relative mx-auto">
					<div className="bg-overlay rounded-12 overflow-hidden">
						<img className="w-100 h-100 img-fluid img-banner" src="/assets/imgs/page-header/banner6.png" alt="Carento" />
					</div>
					<div className="container position-absolute z-1 top-50 start-50 pb-70 translate-middle text-center">
						<span className="text-sm-bold bg-2 px-4 py-3 rounded-12">Find cars for sale and for rent near you</span>
						<h2 className="text-white mt-4">Find Your Perfect Car</h2>
						<span className="text-white text-lg-medium">Search and find your best car rental with easy way</span>
					</div>
					<div className="background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none d-none d-md-flex">
						<Link href="/" className="neutral-700 text-md-medium">Home</Link>
						<span className="@@ds-prev-page">
							<img src="/assets/imgs/template/icons/arrow-right.svg" alt="Carento" />
						</span>
						<Link href="#" className="neutral-1000 text-md-bold">@@prev-page</Link>
						<span>
							<img src="/assets/imgs/template/icons/arrow-right.svg" alt="Carento" />
						</span>
						<Link href="#" className="neutral-1000 text-md-bold text-nowrap">@@current-page</Link>
					</div>
				</div>
			</div>

		</>
	)
}
