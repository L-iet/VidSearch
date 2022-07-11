# Copyright (c) 2022, Joshua Mark
# All rights reserved.

# This source code is licensed under the BSD-style license found in the
# LICENSE file in the root directory of this source tree. 

import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled
  

#load_dotenv('.env')
port = os.environ['PORT']

def getYTVidID(link):
	if 'youtube.com' in link:
		if not '/embed' in link:
			ind = link.find('?v=')
			id_ = link[ind+3:]
		else:
			s_ind, e_ind = link.find('/embed') + 7, link.find('?')
			if e_ind == -1: e_ind = len(link) + 1
			return link[s_ind:e_ind]
	elif 'youtu.be' in link:
		ind = link.find('.be/')
		id_ = link[ind+4:]
	else:
		id_ = link
	return id_

class Transcript:
	def __init__(self, l):
		self.transcript_list = l
		#format is [{text: ..., start: ..., duration: ...}, ...]
	def find_index(self, s_time: int):
		left = 0; right = len(self.transcript_list)

		while left <= right:
			mid = (left + right)//2
			d = self.transcript_list[mid]
			if d['start'] <= s_time <= (d['start'] + d['duration']):
				return mid
			elif s_time < d['start']:
				right = mid
			else:
				left = mid + 1
		return -1


	def find_first_n_occurs(self, word: str, start_time: int = 0, stop_time: int = 1, n: int = 0):
		"""n=0 means find all occurences"""
		ret_val = []
		if start_time == 0:
			start_ind = 0
		else:
			start_ind = self.find_index(start_time)
		if stop_time == 1:
			stop_ind = len(self.transcript_list)
		else:
			stop_ind = self.find_index(stop_time) + 1
		if start_ind == -1: start_ind = 0
		if stop_ind == -1: stop_ind = len(self.transcript_list)

		for indx, transc in enumerate(self.transcript_list[start_ind:stop_ind]):
			if transc['text'].find(word) >= 0:
				ret_val.append(indx + start_ind)
			lr = len(ret_val)
			if lr >= 1:
				if lr >= n or n == 0:
					break

		return ret_val
	def find_times(self, word, start_time, stop_time, n):
		inds = self.find_first_n_occurs(word, start_time, stop_time, n)
		return [
			#[
			self.transcript_list[ind]['start']
			#self.transcript_list[ind]['start'] + self.transcript_list[ind]['duration'] ] 
			for ind in inds]


def to_timestamp(t):
	t = int(t)
	hrs = t // 3600
	m = (t // 60) - (60*hrs)
	s = t % 60
	return f"{str(hrs).rjust(2,'0') if hrs else ''}:{str(m).rjust(2,'0')}:{str(s).rjust(2,'0')}"


app = Flask(__name__)

@app.route('/')
def home():
	return render_template('index.html')

@app.route('/searchResult',methods=['POST'])
def getLink():
	link = request.form['link'] #sanitise the links if necessary
	word = request.form['word'].lower()
	start_time = request.form['startTime']
	start_time = int(start_time)
	stop_time = request.form['stopTime']
	stop_time = int(stop_time)
	n = int(request.form['n'])
	if start_time > stop_time and stop_time != 1:
		return "Invalid range given"

	try:
		vidID = getYTVidID(link)
		srt = YouTubeTranscriptApi.get_transcript(vidID)
	  
		T_obj = Transcript(srt)
		times = T_obj.find_times(word, start_time, stop_time, n)
		if len(times) == 0: return "No results found in this video."
		timestr = list(map(to_timestamp, times))
		url = f"https://www.youtube.com/embed/{vidID}?start={round(times[0])}"
		return render_template('displayVideo.html',url_for_vid=url,times=list(map(int, times)),timestr=timestr, enum=enumerate )
	except TranscriptsDisabled:
		return "An error occurred, or we can't currently transcribe this video."

	return "Default Page"


if __name__ == '__main__':
	app.run(port=port)

