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
class SearchEngine {
	public static $stopwords = ",de,a,o,que,e,do,da,em,um,para,é,com,não,uma,os,no,se,na,por,mais,as,dos,como,mas,foi,ao,ele,das,tem,à,seu,sua,ou,serei,quando,muito,ha,nos,já,esta,eu,também,só,pelo,pela,até,isso,ela,entre,era,depois,sem,mesmo,aos,ter,seus,quem,nas,me,esse,eles,estao,você,tinha,foram,essa,num,nem,suas,meu,às,minha,tem,numa,pelos,elas,havia,seja,qual,sera,nós,tenho,lhe,deles,essas,esses,pelas,este,fosse,dele,tu,te,vocês,vos,lhes,meus,minhas,teu,tua,teus,tuas,nosso,nossa,nossos,nossas,dela,delas,esta,estes,estas,aquele,aquela,aqueles,aquelas,isto,aquilo,estou,está,estamos,estão,estive,esteve,estivemos,estiveram,estava,estávamos,estavam,estivera,estivéramos,esteja,estejamos,estejam,estivesse,estivéssemos,estivessem,estiver,estivermos,estiverem,hei,há,havemos,hão,houve,houvemos,houveram,houvera,houvéramos,haja,hajamos,hajam,houvesse,houvéssemos,houvessem,houver,houvermos,houverem,houverei,houverá,houveremos,houverão,houveria,houveríamos,houveriam,sou,somos,são,era,éramos,eram,fui,foi,fomos,foram,fora,fôramos,seja,sejamos,sejam,fosse,fôssemos,fossem,for,formos,forem,serei,será,seremos,serão,seria,seríamos,seriam,tenho,tem,temos,tém,tinha,tínhamos,tinham,tive,teve,tivemos,tiveram,tivera,tivéramos,tenha,tenhamos,tenham,tivesse,tivéssemos,tivessem,tiver,tivermos,tiverem,terei,terá,teremos,terão,teria,teríamos,teriam,";
	public static $prefix = ",des,ins,";
	public static $suffix = ",ado, ada, mento,";

	static function normalizeWords($words){
		require_once('tool/utility.php');
		$words = normalize_chars($words);
		$words = strtolower($words);
		return $words;
	}

	static function prepareWords($words) {

		$words=SearchEngine::normalizeWords($words);		

		$words = explode(" ",$words);
		$i=0;
		while ($i<sizeof($words)){

			$words[$i]=trim($words[$i]);

				if (strpos(SearchEngine::$stopwords,",".$words[$i].",")!==false) {$words[$i]='';}
				else $words[$i] = SearchEngine::getRadical($words[$i]);
				if (strpos(SearchEngine::$stopwords,",".$words[$i].",")!==false) {$words[$i]='';}
				$words[$i]=trim($words[$i]);
			
			$i++;
		}
		
		return $words;

	}

	static function getRadical($word){
		$prefix = SearchEngine::$prefix;
		$suffix = SearchEngine::$suffix;
		if (strpos($prefix,",".substr($word,0,2).",")!==false){
			$word = substr($word,2);
		} elseif (strpos($prefix,",".substr($word,0,3)."," )!==false){
			$word = substr($word,3);
		}

		if (strpos($suffix, ",".substr($word,-1).",")!==false){
			$word = substr($word,0,strlen($word)-1);
		} elseif (strpos($suffix, ",".substr($word,-2).",")!==false){
			$word = substr($word,0,strlen($word)-2);
		} elseif (strpos($suffix, ",".substr($word,-3).",")!==false){
			$word = substr($word,0,strlen($word)-3);
		} elseif (strpos($suffix, ",".substr($word,-4).",")!==false){
			$word = substr($word,0,strlen($word)-4);
		}

		return $word;
	}

	static function getQueryTopics($words){
		$words=SearchEngine::prepareWords($words);

		$query = "SELECT * FROM vw_topic_notoff WHERE id IN (";
		$query .= "SELECT S.id FROM topic as S LEFT JOIN post as C ON S.id=C.topicid WHERE 1=1";
		for ($i=0;$i<sizeof($words);$i++){
			$query.=" AND (lower(S.msg) like lower('%".$words[$i]."%') OR lower(S.subject) like lower('%".$words[$i]."%') OR lower(C.post) like lower('%".$words[$i]."%'))";
		}

		$query.=") order by orderid desc";
		return $query;
	}

	static function getQueryChannels($words){

		$user=$_SESSION['user'];
		$_anon=($user->isAnon())?'true':'false';

		$words=SearchEngine::prepareWords($words);

		$ORDERBY='S.haslogo desc, S.qt_followers desc';

		$query = "SELECT *,((CASE haslogo WHEN 'true' THEN 1 ELSE 0 END)*100+qt_followers*random()) as QUERY_rank FROM vw_channel as S WHERE (1=1";
		for ($i=0;$i<sizeof($words);$i++){
			switch ($words[$i]){
				case '[mychannels]':
					if (!$user->isAnon())
						$query.=" AND userid='{$user->getId()}'";
					break;
				case '[signedchannels]':
					$query.=" AND S.id in (SELECT channelid from follow_channel_user WHERE userid='{$user->getId()}' and anon='{$_anon}')";
					break;
				case '[suggestchannels]':
					$_anon= ($user->isAnon())?'true':'false';
					$addwhere='';if (!($user->isAnon())) $addwhere.=" and userid!='{$user->getId()}'";
					$query.=" AND S.id not in (select channelid from follow_channel_user where userid='{$user->getId()}' and anon='{$_anon}') {$addwhere} ";
					$ORDERBY='QUERY_rank desc';
					break;
				default:
					$query.=" AND (lower(S.pp_name) like lower('%".$words[$i]."%') OR lower(S.pp_description) like lower('%".$words[$i]."%') )";
					break;
			}
		}

		$query.=") ORDER BY {$ORDERBY}";
		return $query;
	}

}

?>
