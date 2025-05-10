"use client"
import HeroSearch from "../elements/HeroSearch"
import { useState } from "react";
import PhoneVerificationModal from "../elements/PhoneVerificationModal";

export default function Search1() {
	const [selectedOption, setSelectedOption] = useState<"one-way" | "round-trip" | "local" | "airport">("one-way");

	const handleRadioChange = (value: "one-way" | "round-trip" | "local" | "airport") => {
		setSelectedOption(value);

	};
	return (
		<>

			<section className="box-section box-search-advance-home10 background-100">
				<div className="container">
					<div className="box-search-advance background-card wow fadeIn">
						<div className="box-top-search">
							<div className="left-top-search">
								<button style={{ background: "none", border: "none" }}
									className={`category-link text-sm-bold btn-click ${selectedOption === 'one-way' ? 'active' : ''}`}
									onClick={() => handleRadioChange('one-way')}
								>
									One Way
								</button>
								<button style={{ background: "none", border: "none" }}
									className={`category-link text-sm-bold btn-click ${selectedOption === 'round-trip' ? 'active' : ''}`}
									onClick={() => handleRadioChange('round-trip')}
								>
									Round Trip
								</button>
								<button style={{ background: "none", border: "none", display: "none" }}
									className={`category-link text-sm-bold btn-click ${selectedOption === 'local' ? 'active' : ''}`}
									onClick={() => handleRadioChange('local')}
								>
									Local
								</button>
								<button style={{ background: "none", border: "none" }}
									className={`category-link text-sm-bold btn-click ${selectedOption === 'airport' ? 'active' : ''}`}
									onClick={() => handleRadioChange('airport')}
								>
									Airport
								</button>
							</div>
							<div className="right-top-search d-none d-md-flex">
								{/* <PhoneVerificationModal /> */}
							</div>
						</div>
						<HeroSearch selectedOption={selectedOption} />
					</div>
				</div>
			</section>
		</>
	)
}
