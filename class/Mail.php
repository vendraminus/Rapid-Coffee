<?php
/*	RapidCoffee is a free, opensource dynamic internet forum.
	(C) Copyright 2011.

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
?>
<?php

require_once('conf/config.php');

class Mail{

	private $header;
	private $subject;
	private $email_to;
	private $nickname_to;
	private $email_from;
	private $nickname_from;
	private $subject_msg;
	private $msg;
	private $body_header_SETTED;
	private $body_footer_SETTED;

	private $body_header;
	private $body_footer;

	function setEmailTo($param){ $this->email_to=$param; }
	function setNicknameTo($param){ $this->nickname_to=$param; }
	function setSubject($param){ $this->subject=$param; }
	function setSubjectMsg($param){ $this->subject_msg=$param; }
	function setMsg($param){ $this->msg=$param; }

	function setEmailFrom($param){ $this->email_from=$param; }
	function setNicknameFrom($param){ $this->nickname_from=$param; }
	function setHeader($param){ $this->header=$param; }
	function setBodyHeader($param){ $this->body_header_SETTED=1; $this->body_header=$param; }
	function setBodyFooter($param){ $this->body_footer_SETTED=1; $this->body_footer=$param; }

	function __construct(){
		global $CONF;
		$this->body_header_SETTED=0;
		$this->body_footer_SETTED=0;
		$this->email_from = $CONF['email_from'];
		$this->nickname_from = 'Rapid Coffee';
		$this->header="MIME-Version: 1.0\r\nContent-type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit\r\n";
		$this->subject='Rapid Coffee';
	}

	function setDefaultHeader(){
		$this->body_header='
			<html>
				<head>
					<meta name="viewport" content="initial-scale=1.0; maximum-scale=1.0;" />
					<style type="text/css">
						@media only screen and (max-device-width: 480px) {
							body {
								padding: 10px !important;
							}
							table {
								width: 100% !important;		
								font-size: 11px; 
								font-family: arial; 
								color: #4d4d4d;
							}
							td {
								word-wrap: break-word;
								font-size: 11px; 
								font-family: arial; 
								color: #4d4d4d;
							}
							a {
								word-wrap: break-word;
							}
						}
					</style>
				</head>
				<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" bgcolor="#ffffff" >
					<table width="100%" cellpadding="10" cellspacing="0" bgcolor="#ffffff" >
						<tr>
							<td valign="top" align="center">
								<table width="740" cellpadding="0" cellspacing="0">
									<tr>
										<td style="background-color:#FFFFFF;border-top:0px solid #333333;border-bottom:30px solid #FFFFFF;"><IMG SRC="http://rapidcoffee.com/imgs/logo.png" BORDER="0" title="RapidCoffee"  alt="RapidCoffee">
										</td>
									</tr>
								</table>
								<table border="0" cellspacing="0" cellpadding="0" width="740">
									<tr>
										<td style="font-family: arial; font-size: 12px; line-height: 150%; border-bottom: 25px solid #ffffff;">
											Ol&aacute; '.$this->nickname_to.'!<br>
											'.$this->subject_msg.'
										</td>
									</tr>
								</table>
								<table border="0" cellspacing="0" cellpadding="0" width="740">
									<tr>
										<td style="font-family: arial; font-size: 12px; line-height: 150%; border-bottom: 25px solid #ffffff;">
			';
	}

	function setDefaultFooter(){
		$this->body_footer='
										</td>
									</tr>
								</table>
								<table border="0" cellspacing="0" cellpadding="0" width="740" style="border-top: 25px solid #FFFFFF;">
									<tr>
										<td style="font-size: 11px; font-family: arial; color: #4d4d4d; border-top: 1px solid #c0c0c0;">
											<p style="border-top: 20px solid #FFFFFF;">
												RapidCoffee &eacute; a mais nova rede social brasileira. Voc&ecirc; poder&aacute; assinar e criar canais sobre o assunto que desejar, participando ou criando comunidades. <a href="http://rapidcoffee.com">Participe j&aacute;!</a>
											</p>
											<p style="border-top: 20px solid #FFFFFF;">
												N&atilde;o quer receber mais e-mails? Para desativar os e-mails de notifica&ccedil;&atilde;o, <a href="http://rapidcoffee.com/engine.php?SYSTEM_redirect=1&what=user_stopmail&a=feea881fez&b='.urlencode($this->email_to).'&c='.urlencode(substr(hash('sha512',"i want".$this->email_to."Θ never 咖啡 receive email食物"),0,8)).'">clique aqui</a>.
											</p>
										</td>
									</tr>
									<tr>
										<td align="center" style="font-family: Arial; font-size: 11px; font-weight: bold;  color: #4d4d4d; border: 30px solid #fff;">&copy; RapidCoffee - 2011 - vers&atilde;o beta</td>
									</tr>
								</table>

							</td>
						</tr>
					</table>
				</body>
			</html>
		';

	}

	function send(){

//		$this->email_to="lucasvendramin85@gmail.com";

		$this->header .= "From: {$this->nickname_from} <{$this->email_from}>\r\n";
		$this->header .= "To: {$this->nickname_to} <{$this->email_to}>\r\n";

		if (!$this->body_header_SETTED)
			$this->setDefaultHeader();
		if (!$this->body_footer_SETTED)
			$this->setDefaultFooter();

		$this->subject = '[RapidCoffee] '.$this->subject;
		$this->subject = $this->encode_subject($this->subject,"UTF-8");

		return mail($this->email_to, $this->subject, $this->body_header.$this->msg.$this->body_footer, $this->header);

//		echo "mail({$this->email_to}, {$this->subject}, ".$this->body_header.$this->msg.$this->body_footer.", {$this->header});";

	}

	function encode_subject($subject,$charset) { 
		if (function_exists('quoted_printable_encode')) {
			$subject_c = quoted_printable_encode($subject);
			return '=?'.$charset.'?Q?'.$subject_c.'?=';
		} elseif (function_exists('imap_8bit')) {
			$subject_c = imap_8bit($subject);
			return '=?'.$charset.'?Q?'.$subject_c.'?=';
		// Utiliza a codificacao base64 (B)
		} else {
			$subject_c = base64_encode($subject);
			return '=?'.$charset.'?B?'.$subject_c.'?=';
		}
	}

}

?>
