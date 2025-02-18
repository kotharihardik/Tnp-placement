import { Link } from "react-router-dom";
import collegeImg from "../assets/college.jpg"; // College image
import tnpImg from "../assets/tnp.jpg"; // Training & Placement Cell image
import companiesImg from "../assets/companies_tree.jpg"; // Companies tree image
import logo1 from "../assets/logo1.png"; // College logo 1
import logo2 from "../assets/logo2.png"; // College logo 2
import { FaSearch } from "react-icons/fa";

// const BASE_URL = process.env.BASE_URL;

const Home = () => {
    return (
        // <div className="min-h-screen bg-black">
        <div className='w-full '>
            {/* Hero Section */}
            <header
                className='relative h-screen flex items-center justify-center text-center text-white bg-cover bg-center'
                style={{ backgroundImage: `url(${collegeImg})` }}
            >
                <div className='absolute inset-0 bg-black bg-opacity-60'></div>
                <div className='relative z-10 max-w-3xl mx-auto p-6'>
                    <img src={logo1} alt='SCET Logo' className='mx-auto mb-4 w-28 h-auto' />
                    <h1 className='text-4xl font-bold uppercase tracking-widest'>Sarvajanik College of Engineering & Technology</h1>
                    <p className='mt-3 text-lg text-gray-300'>Empowering Engineers, Shaping Futures</p>

                    <Link
    to='/jobs'
    className='mt-6 inline-flex items-center bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-semibold transition'
>
    <FaSearch size={20} className='text-white mr-2' />
    Explore Opportunities
</Link>


                </div>
            </header>

            {/* About TNP Cell */}
            <section className='max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center'>
                <img src={tnpImg} alt='TNP Cell' className='rounded-lg shadow-lg' />
                <div>
                    <h2 className='text-3xl font-bold text-gray-800'>Training & Placement Cell</h2>
                    <p className='mt-3 text-gray-600 leading-relaxed'>
                        Our Training & Placement Cell is dedicated to bridging the gap between students and industries. We provide career counseling, internship
                        opportunities, and campus recruitment drives to help students secure their dream jobs.
                    </p>
                    <Link to='/about' className='mt-4 inline-block text-blue-500 hover:underline font-semibold'>
                        Learn More →
                    </Link>
                </div>
            </section>

            {/* Why Choose SCET? */}
            <section className='bg-gray-100 py-12'>
                <div className='max-w-6xl mx-auto px-6'>
                    <h2 className='text-3xl font-bold text-gray-800 text-center'>Why Choose SCET?</h2>
                    <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {[
                            { title: "100+ Recruiters", desc: "Top MNCs and startups hire our students every year." },
                            { title: "Modern Infrastructure", desc: "State-of-the-art labs, classrooms, and libraries." },
                            { title: "Industry Collaboration", desc: "Strong ties with industries for internships & projects." },
                        ].map((item, index) => (
                            <div key={index} className='bg-white p-6 rounded-lg shadow-lg text-center'>
                                <h3 className='text-xl font-semibold text-gray-800'>{item.title}</h3>
                                <p className='text-gray-600 mt-2'>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recruiters Section */}
            <section className='max-w-6xl mx-auto px-6 py-12 text-center'>
                <h2 className='text-3xl font-bold text-gray-800'>Our Recruiters</h2>
                <p className='text-gray-600 mt-2'>Top companies hiring SCET graduates</p>
                <img src={companiesImg} alt='Companies Tree' className='mx-auto mt-6 rounded-lg shadow-lg w-full max-w-4xl' />
            </section>

            {/* Footer */}
            <footer className='bg-gray-900 text-white py-8'>
                <div className='max-w-6xl mx-auto px-6 flex flex-wrap justify-between'>
                    <div className='mb-4'>
                        <img src={logo2} alt='SCET Logo' className='w-24 h-auto' />
                        <p className='text-sm text-gray-400 mt-2'>Sarvajanik College of Engineering & Technology, Surat</p>
                    </div>
                    <div>
                        <h4 className='text-lg font-semibold'>Quick Links</h4>
                        <ul className='mt-2 text-gray-400'>
                            <li>
                                <Link to='/jobs' className='hover:text-white'>
                                    Job Openings
                                </Link>
                            </li>
                            <li>
                                <Link to='/about' className='hover:text-white'>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to='/contact' className='hover:text-white'>
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className='text-lg font-semibold'>Contact</h4>
                        <p className='text-gray-400 mt-2'>Phone: +91 12345 67890</p>
                        <p className='text-gray-400'>Email: tnp@scet.ac.in</p>
                    </div>
                </div>
                <p className='text-center text-gray-500 text-sm mt-6'>&copy; {new Date().getFullYear()} SCET. All rights reserved.</p>
            </footer>
        </div>
        // </div>
    );
};

export default Home;
