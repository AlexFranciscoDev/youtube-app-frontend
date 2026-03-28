import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'

export const Footer = () => {
    return (
        <footer className='bg-[var(--background-card)]'>
            <div className='layout-container'>
                <h3 className='text-center text-md font-normal'>
                    Alex Francisco Dev - 2026 All rights reserved
                </h3>
                <div className='flex justify-center gap-3 pt-5'>
                    <FontAwesomeIcon
                        icon={faGithub}
                        className='social-icon'
                    />
                    <FontAwesomeIcon
                        icon={faLinkedin}
                        className='social-icon'
                    />
                </div>
            </div>
        </footer>
    )
}
