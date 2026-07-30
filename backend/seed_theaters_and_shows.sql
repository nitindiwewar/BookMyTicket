-- =========================================================
-- BookMySeat SQL Seed Script: Mock Theaters & Facilities
-- Execute against MySQL Database `movieticket`
-- =========================================================

-- 1. Insert City Mock Multiplexes & Single Screens
INSERT IGNORE INTO theaters (id, area, city, name) VALUES
('mum-1', 'BKC, Bandra West, Mumbai', 'Mumbai', 'PVR Maison Jio World Drive'),
('mum-2', 'Malad West, Mumbai', 'Mumbai', 'INOX Megaplex Inorbit Mall'),
('mum-3', 'Andheri West, Mumbai', 'Mumbai', 'Cinepolis VIP Fun Republic'),
('mum-4', 'Wadala, Mumbai', 'Mumbai', 'Carnival Cinemas IMAX'),
('del-1', 'Vasant Kunj, New Delhi', 'Delhi NCR', 'PVR Director''s Cut'),
('del-2', 'Nehru Place, New Delhi', 'Delhi NCR', 'INOX Laserplex'),
('del-3', 'Saket, New Delhi', 'Delhi NCR', 'Cinepolis DLF Avenue'),
('blr-1', 'Rajajinagar, Bengaluru', 'Bengaluru', 'PVR Orion Mall IMAX'),
('blr-2', 'Forum Shantiniketan, Whitefield, Bengaluru', 'Bengaluru', 'Cinepolis VIP Luxe Cinema'),
('blr-3', 'MG Road, Bengaluru', 'Bengaluru', 'INOX Lido Mall'),
('hyd-1', 'Gachibowli, Hyderabad', 'Hyderabad', 'AMB Cinemas: Gachibowli'),
('hyd-2', 'Kukatpally, Hyderabad', 'Hyderabad', 'PVR Forum Sujana Mall'),
('hyd-3', 'Banjara Hills, Hyderabad', 'Hyderabad', 'INOX GVK One Mall'),
('hyd-4', 'Kukatpally, Hyderabad', 'Hyderabad', 'Cinepolis VIP Nexus Mall'),
('kol-1', 'Park Circus, Kolkata', 'Kolkata', 'INOX Quest Mall Superplex'),
('kol-2', 'EM Bypass, Kolkata', 'Kolkata', 'PVR Mani Square'),
('chn-1', 'Royapettah, Chennai', 'Chennai', 'SPI Sathyam Luxe Cinema'),
('chn-2', 'Anna Nagar, Chennai', 'Chennai', 'PVR VR Chennai'),
('pun-1', 'Magarpatta, Pune', 'Pune', 'Cinepolis Seasons Mall'),
('pun-2', 'Viman Nagar, Pune', 'Pune', 'PVR Marketcity'),
-- Nagpur City Multiplexes & Classic Cinemas
('nag-1', 'Kamptee Road, Nagpur', 'Nagpur', 'INOX Jaswant Tuli Mall'),
('nag-2', 'Empress City, Near Station, Nagpur', 'Nagpur', 'PVR Empress City Mall'),
('nag-3', 'Medical Square, Great Nag Road, Nagpur', 'Nagpur', 'Cinepolis VR Mall'),
('nag-4', 'Variety Square, Sitabuldi, Nagpur', 'Nagpur', 'MovieMax Eternity Mall'),
('nag-5', 'Dharampeth, Nagpur', 'Nagpur', 'Alankar Talkies'),
('nag-6', 'Sadar, Nagpur', 'Nagpur', 'Liberty Cinema'),
('nag-7', 'Residency Road, Sadar, Nagpur', 'Nagpur', 'Smruti Cinema');

-- 2. Insert Theater Facilities
INSERT IGNORE INTO theater_facilities (theater_id, facility) VALUES
('mum-1', 'IMAX 3D'), ('mum-1', 'Dolby Atmos'), ('mum-1', 'Recliners'), ('mum-1', 'Food Hall'),
('mum-2', 'MX4D'), ('mum-2', 'ScreenX'), ('mum-2', 'Laser'), ('mum-2', 'Gourmet Menu'),
('mum-3', 'VIP Lounge'), ('mum-3', 'Dolby 7.1'), ('mum-3', 'Butler Service'),
('mum-4', 'IMAX Dome'), ('mum-4', 'Dolby Atmos'),
('del-1', 'Luxury Recliners'), ('del-1', 'Fine Dining'), ('del-1', '4K Laser'),
('del-2', 'RGB Laser'), ('del-2', 'Dolby Atmos'), ('del-2', 'Recliners'),
('del-3', 'VIP Lounge'), ('del-3', 'Dolby Atmos'),
('blr-1', 'IMAX 3D'), ('blr-1', '4DX'), ('blr-1', 'Dolby Atmos'), ('blr-1', 'Recliners'),
('blr-2', 'VIP Luxe'), ('blr-2', 'Recliners'),
('blr-3', 'Dolby 7.1'), ('blr-3', 'Food Court'),
('hyd-1', 'Laser Screen'), ('hyd-1', 'Dolby Atmos'), ('hyd-1', 'VVIP Lounge'), ('hyd-1', 'Recliners'),
('hyd-2', '4DX'), ('hyd-2', 'Dolby Atmos'), ('hyd-2', 'Play House'),
('hyd-3', 'INSIGNIA'), ('hyd-3', 'Dolby Atmos'),
('hyd-4', 'VIP Lounge'), ('hyd-4', 'Laser'),
('kol-1', 'INSIGNIA'), ('kol-1', 'IMAX 3D'), ('kol-1', 'Dolby Atmos'),
('kol-2', '4DX'), ('kol-2', 'Gourmet Kitchen'),
('chn-1', 'RDX 4K'), ('chn-1', 'Dolby Atmos'), ('chn-1', 'Popcorn Bar'),
('chn-2', 'P[XL]'), ('chn-2', '4DX'), ('chn-2', 'Recliners'),
('pun-1', '4DX'), ('pun-1', 'Dolby Atmos'), ('pun-1', 'VIP Recliners'),
('pun-2', 'IMAX 3D'), ('pun-2', 'Food Court'),
('nag-1', 'RGB Laser'), ('nag-1', 'Dolby Atmos 7.1'), ('nag-1', 'Plush Seating'),
('nag-2', 'P(XL) Large Screen'), ('nag-2', 'Recliners'), ('nag-2', 'Food Court'),
('nag-3', 'VIP Lounge'), ('nag-3', 'Dolby Atmos'),
('nag-4', '4DX Motion'), ('nag-4', 'Gourmet Kitchen'),
('nag-5', '2K Projection'), ('nag-5', 'Dolby Digital'),
('nag-6', 'Heritage Cinema'), ('nag-6', 'Dolby 7.1'),
('nag-7', 'Digital Sound'), ('nag-7', 'Snack Bar');
