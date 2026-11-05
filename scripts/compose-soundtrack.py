"""Original Mew Quest chiptune: Garden Treasures. No sampled recordings."""
import math, wave, struct, array
from pathlib import Path
RATE=22050
EIGHTH=60/(108*3) # gentle 6/8 at 108 dotted-quarter beats per minute
BARS=32
LENGTH=BARS*6*EIGHTH
mix=array.array('f',[0.0])*round(RATE*LENGTH)
# Original folk-like melody in G major: six eighth-note positions per bar.
melody=[
 [74,71,67,69,71,74],[76,74,71,69,67,66],
 [67,71,74,79,78,74],[76,74,72,71,69,66],
 [71,74,79,78,76,74],[72,76,79,81,79,76],
 [74,71,69,67,66,69],[67,0,71,74,0,0],
 [79,78,74,76,79,81],[83,81,79,78,76,74],
 [76,79,83,81,79,76],[78,76,74,72,71,69],
 [71,74,79,83,81,79],[76,72,69,72,76,79],
 [78,74,69,72,71,66],[67,71,74,71,69,66]]
chords=[(43,55,59,62),(38,54,57,62),(40,55,59,64),(38,54,57,62),
 (43,55,59,62),(48,55,60,64),(38,54,57,62),(43,55,59,62),
 (40,55,59,64),(47,54,59,62),(48,55,60,64),(38,54,57,62),
 (43,55,59,62),(48,55,60,64),(38,54,57,62),(38,54,57,62)]
def note(midi,start,duration,volume,voice):
 if not midi:return
 freq=440*2**((midi-69)/12)
 begin=round(start*RATE);count=min(round(duration*RATE),len(mix)-begin)
 for j in range(max(0,count)):
  t=j/RATE;phase=2*math.pi*freq*t
  if voice=='lead':signal=(math.sin(phase)+math.sin(3*phase)/3+math.sin(5*phase)/5)/1.54
  elif voice=='bass':signal=(math.sin(phase)-math.sin(3*phase)/9+math.sin(5*phase)/25)/1.15
  else:signal=(math.sin(phase)+.35*math.sin(2*phase)+.16*math.sin(4*phase))/1.51
  attack=min(1,t/.004);release=min(1,(duration-t)/.022)
  decay=math.exp(-t*(5 if voice=='arp' else 1.8))
  mix[begin+j]+=signal*volume*attack*max(0,release)*decay
for bar in range(BARS):
 root,a,b,c=chords[bar%16]
 for beat,m in enumerate(melody[bar%16]):
  at=(bar*6+beat)*EIGHTH
  # A softer second chorus adds short octave ornaments.
  note(m,at,EIGHTH*.88,.20,'lead')
  if bar>=16 and beat in (0,3):note(m+12,at,EIGHTH*.40,.035,'arp')
  arpeggio=[a,b,c,a+12,c,b][beat]
  note(arpeggio,at,EIGHTH*.72,.075,'arp')
  if beat in (0,3):note(root if beat==0 else root+7,at,EIGHTH*2.4,.16,'bass')
# Soft head/tail edges prevent clicks at the seamless tonic-to-dominant repeat.
for i in range(128):
 mix[i]*=i/128;mix[-1-i]*=i/128
peak=max(abs(v)for v in mix)
out=Path(__file__).resolve().parents[1]/'dist/assets/garden-treasures.wav'
with wave.open(str(out),'wb')as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE)
 w.writeframes(b''.join(struct.pack('<h',round(v/peak*.78*32767))for v in mix))
print(f'{out.name}: {LENGTH:.2f}s, {RATE}Hz, peak limited to -2.2dB')
