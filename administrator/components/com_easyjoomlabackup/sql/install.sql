CREATE TABLE IF NOT EXISTS `#__easyjoomlabackup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `comment` tinytext NOT NULL,
  `type` varchar(32) NOT NULL,
  `size` varchar(12) NOT NULL,
  `duration` varchar(8) NOT NULL,
  `name` tinytext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;