import React from 'react';
import { CricketCVFull, CareerEntry, StatisticsBlock, Achievement, ProfessionalExperience, Education, Certification, Reference } from '../CVTypes';
import { User, Phone, Mail, MapPin, Globe, Award, Calendar, Shield, Linkedin, Instagram, Twitter } from 'lucide-react';
import { CVPaginatedRenderer, CVAtomicBlock, CVSectionHeading, CVColumn, usePageContext } from './registry/CVPaginationEngine';

interface TemplateProps {
  cv: CricketCVFull;
  accentColour: string;
  font: string;
  isPreview?: boolean;
  isCapture?: boolean;
}

// Global helper to get font family string
export const getFontFamily = (fontName: string) => {
  switch (fontName) {
    case 'Montserrat': return "'Montserrat', sans-serif";
    case 'Poppins': return "'Poppins', sans-serif";
    case 'Roboto': return "'Roboto', sans-serif";
    case 'Open Sans': return "'Open Sans', sans-serif";
    case 'Lato': return "'Lato', sans-serif";
    case 'Merriweather': return "'Merriweather', serif";
    case 'Source Sans': return "'Source Sans Pro', sans-serif";
    case 'Playfair Display': return "'Playfair Display', serif";
    case 'Inter':
    default: return "'Inter', sans-serif";
  }
};

// Watermark Component
const Watermark = () => (
  <div 
    className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-50"
    style={{ pointerEvents: 'none', touchAction: 'none' }}
  >
    <div 
      className="text-slate-400/20 text-4xl md:text-5xl font-black uppercase tracking-widest border-4 border-slate-400/20 px-8 py-4 rounded-xl rotate-[-30deg] text-center"
      style={{ whiteSpace: 'nowrap' }}
    >
      THE CRICKET ADVISOR<br/>
      <span className="text-xl tracking-wider">PREVIEW</span>
    </div>
  </div>
);

// Photo / Avatar Helper
const PlayerPhoto = ({ photo, name }: { photo?: string; name: string }) => {
  if (!photo) return null;
  return (
    <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-slate-900 border border-slate-200/20 overflow-hidden flex items-center justify-center shadow-md shrink-0">
      <img 
        src={photo} 
        alt={name} 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

const CVAdditionalContact = ({ cv, align = 'left', textClass = 'text-xs text-slate-600' }: { cv: CricketCVFull; align?: 'left' | 'right' | 'center'; textClass?: string }) => {
  const alignClass = align === 'right' ? 'flex items-center md:justify-end gap-1.5 no-capitalize' : align === 'center' ? 'flex items-center justify-center gap-1.5 no-capitalize' : 'flex items-center gap-1.5 no-capitalize';
  return (
    <>
      {cv.linkedin && <div className={alignClass}><Linkedin className="w-3.5 h-3.5" /> <span className={textClass}>LinkedIn: {cv.linkedin}</span></div>}
      {cv.instagram && <div className={alignClass}><Instagram className="w-3.5 h-3.5" /> <span className={textClass}>Instagram: {cv.instagram}</span></div>}
      {cv.twitter && <div className={alignClass}><Twitter className="w-3.5 h-3.5" /> <span className={textClass}>Twitter: {cv.twitter}</span></div>}
    </>
  );
};

const CVExtraProfileDetails = ({ cv }: { cv: CricketCVFull }) => {
  const showLanguages = cv.languages && cv.languages.length > 0;
  return (
    <div className="space-y-1.5 text-xs text-slate-700">
      {cv.nationality && <div><strong>Country:</strong> {cv.nationality}</div>}
      {cv.dateOfBirth && <div><strong>DOB:</strong> {cv.dateOfBirth}</div>}
      {cv.height && <div><strong>Height:</strong> {String(cv.height).includes("'") ? cv.height : `${cv.height} cm`}</div>}
      {cv.playingRole && <div><strong>Role:</strong> {cv.playingRoleDetail || cv.playingRole}</div>}
      {cv.secondaryRole && <div><strong>Secondary Role:</strong> {cv.secondaryRole}</div>}
      {cv.battingStyle && cv.battingStyle.toLowerCase() !== 'none' && <div><strong>Batting:</strong> {cv.battingStyle}</div>}
      {cv.bowlingStyle && cv.bowlingStyle.toLowerCase() !== 'none' && <div><strong>Bowling:</strong> {cv.bowlingStyle}</div>}
      {cv.throwingArm && <div><strong>Throw:</strong> {cv.throwingArm} Arm</div>}
      {cv.bowlingPace && <div><strong>Pace:</strong> {cv.bowlingPace}</div>}
      {cv.typeOfPlayerLevel && <div><strong>Player Level:</strong> {cv.typeOfPlayerLevel}</div>}
      {cv.highestLevelPlayed && <div><strong>Highest Level:</strong> {cv.highestLevelPlayed}</div>}
      {cv.playerLevelCountry && <div><strong>Country Played:</strong> {cv.playerLevelCountry}</div>}
      {cv.espnLink && (
        <div>
          <strong>ESPN Cricinfo:</strong>{' '}
          <a href={cv.espnLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
            Profile
          </a>
        </div>
      )}
      {cv.crickherosLink && (
        <div>
          <strong>CrickHeroes:</strong>{' '}
          <a href={cv.crickherosLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
            Profile
          </a>
        </div>
      )}
      {cv.currentClub && <div><strong>Club:</strong> {cv.currentClub}</div>}
      {cv.availability && <div><strong>Availability:</strong> {cv.availability}</div>}
      {cv.overseasExperience === true && <div><strong>Overseas Exp:</strong> Yes</div>}
      {cv.internationalExperience === true && <div><strong>Intl Exp:</strong> Yes</div>}
      {showLanguages && <div><strong>Languages:</strong> {cv.languages.join(', ')}</div>}
      {cv.hobbies && cv.hobbies.length > 0 && <div><strong>Hobbies:</strong> {cv.hobbies.join(', ')}</div>}
    </div>
  );
};

const CVExperienceBlock = ({ cv, accentColour }: { cv: CricketCVFull; accentColour: string }) => {
  if (!cv.experience || cv.experience.length === 0) return null;
  return (
    <div>
      <CVSectionHeading id="heading-experience">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 text-slate-900">Professional Experience / Coaching</h2>
      </CVSectionHeading>
      <div className="space-y-3">
        {cv.experience.map((exp, eIdx) => (
          <CVAtomicBlock key={exp.id || eIdx} id={`block-experience-${eIdx}`}>
            <div className="text-xs text-left">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{exp.position} - {exp.organisation}</span>
                <span className="text-slate-500 font-semibold">{exp.startDate} - {exp.endDate}</span>
              </div>
              {exp.location && <div className="text-[10px] text-slate-500">{exp.location}</div>}
              {exp.responsibilities && <p className="text-slate-600 text-[11px] mt-0.5 whitespace-pre-line">{exp.responsibilities}</p>}
              {exp.achievements && <p className="text-slate-500 text-[10px] mt-0.5 italic">Key Achievements: {exp.achievements}</p>}
            </div>
          </CVAtomicBlock>
        ))}
      </div>
    </div>
  );
};

const CVEducationBlock = ({ cv }: { cv: CricketCVFull }) => {
  const showEdu = cv.education && cv.education.length > 0;
  const showCert = cv.certifications && cv.certifications.length > 0;
  if (!showEdu && !showCert) return null;
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {showEdu && (
        <div>
          <CVSectionHeading id="heading-education">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2 text-slate-900">Education</h2>
          </CVSectionHeading>
          <div className="space-y-2">
            {cv.education.map((edu, edIdx) => (
              <CVAtomicBlock key={edu.id || edIdx} id={`block-education-${edIdx}`}>
                <div className="text-xs text-left">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-500 text-[10px] text-left">
                    {[edu.school, edu.year].filter(Boolean).join(' | ')}
                  </div>
                </div>
              </CVAtomicBlock>
            ))}
          </div>
        </div>
      )}
      {showCert && (
        <div>
          <CVSectionHeading id="heading-certifications">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2 text-slate-900">Certifications</h2>
          </CVSectionHeading>
          <div className="space-y-2">
            {cv.certifications.map((cert, ceIdx) => (
              <CVAtomicBlock key={cert.id || ceIdx} id={`block-certification-${ceIdx}`}>
                <div className="text-xs text-left">
                  <div className="font-bold text-slate-900">{cert.certName}</div>
                  <div className="text-slate-500 text-[10px]">{cert.details} | {cert.year}</div>
                </div>
              </CVAtomicBlock>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CVReferencesBlock = ({ cv }: { cv: CricketCVFull }) => {
  const showList = cv.showReferences === 'show' && cv.references && cv.references.length > 0;
  const showReq = cv.showReferences === 'request';
  if (!showList && !showReq) return null;
  return (
    <div>
      <CVSectionHeading id="heading-references">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2 text-slate-900">References</h2>
      </CVSectionHeading>
      {showList && (
        <div className="space-y-2">
          {cv.references.map((ref, rIdx) => (
            <CVAtomicBlock key={ref.id || rIdx} id={`block-reference-${rIdx}`}>
              <div className="text-xs text-slate-700 text-left">
                <div className="font-bold text-slate-900">{ref.name}</div>
                <div className="text-[10px] text-slate-500">{ref.position} - {ref.organisation}</div>
                {ref.relationship && <div className="text-[9px] text-slate-400">Relationship: {ref.relationship}</div>}
                {(ref.email || ref.phone) && (
                  <div className="text-[10px]"><span className="no-capitalize">{ref.email}</span> {ref.email && ref.phone ? '|' : ''} {ref.phone}</div>
                )}
              </div>
            </CVAtomicBlock>
          ))}
        </div>
      )}
      {showReq && (
        <CVAtomicBlock id="block-references-request">
          <p className="text-[11px] text-slate-500 italic text-left">References available upon request.</p>
        </CVAtomicBlock>
      )}
    </div>
  );
};

const CVFitnessBlock = ({ cv, accentColour }: { cv: CricketCVFull; accentColour: string }) => {
  if (!cv.fitnessActivities || cv.fitnessActivities.length === 0) return null;
  return (
    <div className="text-left">
      <CVSectionHeading id="heading-fitness">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 text-slate-900">Fitness & Conditioning</h2>
      </CVSectionHeading>
      <CVAtomicBlock id="block-fitness">
        <div className="flex flex-wrap gap-1.5">
          {cv.fitnessActivities.map((act) => (
            <span key={act} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.75 rounded-md font-semibold border border-slate-200">
              {act}
            </span>
          ))}
        </div>
      </CVAtomicBlock>
    </div>
  );
};

const CVSpecialistSkillsBlock = ({ cv }: { cv: CricketCVFull }) => {
  if (!cv.specialistSkills || cv.specialistSkills.length === 0) return null;
  return (
    <div className="text-left">
      <CVSectionHeading id="heading-specialist-skills">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 text-slate-900">Specialist Cricket Skills</h2>
      </CVSectionHeading>
      <CVAtomicBlock id="block-specialist-skills">
        <div className="flex flex-wrap gap-1.5 animate-fade-in">
          {cv.specialistSkills.map((skill) => (
            <span key={skill} className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold border border-slate-200">
              {skill}
            </span>
          ))}
        </div>
      </CVAtomicBlock>
    </div>
  );
};

const CVAchievementsBlock = ({ cv, accentColour }: { cv: CricketCVFull; accentColour: string }) => {
  if (!cv.achievements || cv.achievements.length === 0) return null;
  return (
    <div>
      <CVSectionHeading id="heading-achievements">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 text-slate-900">Achievements & Awards</h2>
      </CVSectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
        {cv.achievements.map((ach, aIdx) => (
          <CVAtomicBlock key={ach.id || aIdx} id={`block-achievement-${aIdx}`}>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 h-full">
              <div className="flex justify-between items-start text-xs font-bold text-slate-900 mb-1 text-left">
                <span>{ach.title}</span>
                <span className="text-slate-500 font-normal shrink-0">{ach.year}</span>
              </div>
              <div className="text-[10px] text-slate-650 mb-1 text-left">
                {ach.teamEvent}{ach.opponentTeam ? ` vs ${ach.opponentTeam}` : ''}
              </div>
              {ach.description && <p className="text-[10px] text-slate-550 whitespace-pre-line text-left">{ach.description}</p>}
            </div>
          </CVAtomicBlock>
        ))}
      </div>
    </div>
  );
};

const CVCareerHighlightsBlock = ({ cv, accentColour }: { cv: CricketCVFull; accentColour: string }) => {
  if (!cv.careerHighlights || cv.careerHighlights.length === 0) return null;

  const sortedHighlights = [...cv.careerHighlights].sort((a, b) => {
    return (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
  });

  const formatHighlightText = (hl: any) => {
    let prefix = '';
    if (hl.achievement === 'Scored a Match-Winning 100') prefix = 'Match-Winning 100';
    else if (hl.achievement === 'Scored a Match-Winning 50') prefix = 'Match-Winning 50';
    else if (hl.achievement === 'Took a Match-Winning 5-Wicket Haul') prefix = 'Match-Winning 5-Wicket Haul';
    else if (hl.achievement === 'Took 10 Wickets in a Match') prefix = '10-Wicket Match';
    else prefix = hl.achievement;

    return `${prefix} vs ${hl.opponent} — ${hl.tournament}, ${hl.year}`;
  };

  return (
    <div>
      <CVSectionHeading id="heading-highlights">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 text-slate-900">Career Highlights</h2>
      </CVSectionHeading>
      <div className="space-y-1.5 text-left">
        {sortedHighlights.map((hl, hIdx) => (
          <CVAtomicBlock key={hl.id || hIdx} id={`block-highlight-${hl.id}`}>
            <div className="text-xs text-slate-750 font-medium py-1 border-b border-dashed border-slate-100 last:border-0 flex items-start gap-2 text-left">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: accentColour }} />
              <span className="text-slate-800">{formatHighlightText(hl)}</span>
            </div>
          </CVAtomicBlock>
        ))}
      </div>
    </div>
  );
};

const CVFormatStatisticsBlock = ({ cv, accentColour }: { cv: CricketCVFull; accentColour: string }) => {
  const stats = cv.oneDayStats;
  if (!stats || (stats.hasStats !== true && (stats.hasStats as any) !== 'true')) return null;

  const showBatting = cv.showBatting !== false && (cv.showBatting as any) !== 'false';
  const showBowling = cv.showBowling !== false && (cv.showBowling as any) !== 'false';

  if (!showBatting && !showBowling) return null;

  const batDismissals = Math.max(0, (stats.batInnings || 0) - (stats.batNotOuts || 0));
  const batAverage = batDismissals > 0 ? ((stats.batRuns || 0) / batDismissals).toFixed(2) : stats.batRuns ? stats.batRuns.toFixed(2) : '-';
  const batStrikeRate = stats.batBallsFaced > 0 ? (((stats.batRuns || 0) / stats.batBallsFaced) * 100).toFixed(2) : '-';

  const bowlTotalBalls = ((stats.bowlOvers || 0) * 6) + (stats.bowlBalls || 0);
  const bowlAverage = stats.bowlWickets > 0 ? ((stats.bowlRunsConceded || 0) / stats.bowlWickets).toFixed(2) : '-';
  const bowlEconomy = bowlTotalBalls > 0 ? (((stats.bowlRunsConceded || 0) * 6) / bowlTotalBalls).toFixed(2) : '-';
  const bowlBest = stats.bowlBestWickets || stats.bowlBestRuns ? `${stats.bowlBestWickets}/${stats.bowlBestRuns}` : '-';

  return (
    <CVAtomicBlock id="block-stats-container">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 text-slate-900">Career Statistics</h2>
        <div className="space-y-4">
          {showBatting && (
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 text-left">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColour }} />
                BATTING & FIELDING
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[9px] text-slate-700 border-collapse">
                  <thead>
                    <tr className="text-white font-bold border-b border-slate-200" style={{ backgroundColor: accentColour }}>
                      <th className="p-1.5 first:rounded-l-md">M</th>
                      <th className="p-1.5">Innings</th>
                      <th className="p-1.5">Runs</th>
                      <th className="p-1.5">Avg</th>
                      <th className="p-1.5">SR</th>
                      <th className="p-1.5">HS</th>
                      <th className="p-1.5">100/50</th>
                      <th className="p-1.5">Catches</th>
                      <th className="p-1.5 last:rounded-r-md">Stumpings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-semibold text-slate-800">
                      <td className="p-1.5">{stats.batMatches || 0}</td>
                      <td className="p-1.5">{stats.batInnings || 0}</td>
                      <td className="p-1.5 font-bold" style={{ color: accentColour }}>{stats.batRuns || 0}</td>
                      <td className="p-1.5">{batAverage}</td>
                      <td className="p-1.5">{batStrikeRate}</td>
                      <td className="p-1.5">{stats.batHighestScore || 0}{stats.batHighestNotOut ? '*' : ''}</td>
                      <td className="p-1.5">{(stats.batHundreds || 0)}/{(stats.batFifties || 0)}</td>
                      <td className="p-1.5">{stats.fieldCatches || 0}</td>
                      <td className="p-1.5">{stats.fieldStumpings || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showBowling && (
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 text-left">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColour }} />
                BOWLING
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[9px] text-slate-700 border-collapse">
                  <thead>
                    <tr className="text-white font-bold border-b border-slate-200" style={{ backgroundColor: accentColour }}>
                      <th className="p-1.5 first:rounded-l-md">M</th>
                      <th className="p-1.5">Innings</th>
                      <th className="p-1.5">Overs</th>
                      <th className="p-1.5">Runs</th>
                      <th className="p-1.5">Wkts</th>
                      <th className="p-1.5">Avg</th>
                      <th className="p-1.5">Econ</th>
                      <th className="p-1.5 last:rounded-r-md">Best</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-semibold text-slate-800">
                      <td className="p-1.5">{stats.bowlMatches || 0}</td>
                      <td className="p-1.5">{stats.bowlInnings || 0}</td>
                      <td className="p-1.5">{stats.bowlOvers || 0}.{stats.bowlBalls || 0}</td>
                      <td className="p-1.5">{stats.bowlRunsConceded || 0}</td>
                      <td className="p-1.5 font-bold" style={{ color: accentColour }}>{stats.bowlWickets || 0}</td>
                      <td className="p-1.5">{bowlAverage}</td>
                      <td className="p-1.5">{bowlEconomy}</td>
                      <td className="p-1.5">{bowlBest}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </CVAtomicBlock>
  );
};

const CVMediaLinksBlock = ({ cv, accentColour }: { cv: CricketCVFull; accentColour: string }) => {
  if (!cv.mediaLinks || !cv.mediaLinks.some(link => link && link.trim() !== '')) {
    return null;
  }
  return (
    <div>
      <CVSectionHeading id="heading-media-links">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 text-slate-900">Scorecard, Profile & Media Links</h2>
      </CVSectionHeading>
      <div className="space-y-1.5 text-left">
        {cv.mediaLinks.map((link, idx) => {
          if (!link || link.trim() === '') return null;
          const href = link.startsWith('http://') || link.startsWith('https://') 
            ? link 
            : `https://${link}`;
          return (
            <CVAtomicBlock key={idx} id={`block-media-link-${idx}`}>
              <div className="text-xs text-slate-750 font-medium py-1 border-b border-dashed border-slate-100 last:border-0 flex items-start gap-2 text-left">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: accentColour }} />
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all no-capitalize">
                  {link}
                </a>
              </div>
            </CVAtomicBlock>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// DESIGN 01: THE EXECUTIVE
// ==========================================
export function ExecutiveTemplate({ cv, accentColour, font, isPreview }: TemplateProps) {
  const fontStyle = { fontFamily: getFontFamily(font) };
  const borderColour = accentColour;

  return (
    <div 
      className="w-full bg-white text-slate-800 p-8 shadow-inner relative flex flex-col justify-between overflow-hidden" 
      style={{ ...fontStyle, minHeight: '297mm' }}
    >
      {isPreview && cv.paymentStatus !== 'Paid' && <Watermark />}
      
      <div>
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b-2 mb-6" style={{ borderColor: borderColour }}>
          <div className="flex items-center gap-4">
            <PlayerPhoto photo={cv.profilePhoto} name={`${cv.firstName} ${cv.lastName}`} />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {cv.firstName} <span style={{ color: accentColour }}>{cv.lastName}</span>
              </h1>
              <p className="text-sm font-bold text-slate-600 uppercase tracking-widest mt-1">
                {cv.playingRoleDetail || cv.playingRole || 'Cricket Professional'}
              </p>
              {cv.preferredName && (
                <p className="text-xs text-slate-500 italic mt-0.5">Known as: {cv.preferredName}</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 text-left md:text-right space-y-1 text-xs text-slate-600">
            <div className="flex items-center md:justify-end gap-1.5 no-capitalize"><Mail className="w-3.5 h-3.5" /> {cv.email}</div>
            {cv.phone && <div className="flex items-center md:justify-end gap-1.5 no-capitalize"><Phone className="w-3.5 h-3.5" /> {cv.phone}</div>}
            <div className="flex items-center md:justify-end gap-1.5"><MapPin className="w-3.5 h-3.5" /> {cv.currentCity || ''}, {cv.countryOfResidence}</div>
            {cv.personalWebsite && <div className="flex items-center md:justify-end gap-1.5 no-capitalize"><Globe className="w-3.5 h-3.5" /> {cv.personalWebsite}</div>}
            <CVAdditionalContact cv={cv} align="right" />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column: Personal, Cricket Profile, References */}
          <div className="md:col-span-1 space-y-6">
            <CVAtomicBlock id="side-section-profile">
              <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2 text-slate-900">Player Profile</h2>
              <CVExtraProfileDetails cv={cv} />
            </CVAtomicBlock>

            {/* Statistics Summary */}
            <CVFormatStatisticsBlock cv={cv} accentColour={accentColour} />
            
            {/* Scorecard, Profile & Media Links */}
            <CVMediaLinksBlock cv={cv} accentColour={accentColour} />
            
            {/* References */}
            <CVReferencesBlock cv={cv} />
          </div>

          {/* Right Column: About, Playing History, Highlights, Education */}
          <div className="md:col-span-2 space-y-6">
            {cv.aboutPlayer && (
              <CVAtomicBlock id="main-section-about">
                <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2 text-slate-900">About Me</h2>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{cv.aboutPlayer}</p>
              </CVAtomicBlock>
            )}

            {/* Playing Career History */}
            {cv.careerHistory.length > 0 && (
              <CVAtomicBlock id="main-section-history">
                <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3 text-slate-900">Career History</h2>
                <div className="space-y-4">
                  {cv.careerHistory.map((item, cIdx) => (
                    <div key={cIdx} className="relative pl-3 border-l-2" style={{ borderColor: accentColour }}>
                      <div className="flex justify-between items-start text-xs mb-0.5 text-left">
                        <span className="font-bold text-slate-900">{item.teamName}{item.country ? ` - ${item.country}` : ''}</span>
                        <span className="text-slate-500 font-semibold shrink-0">{item.startYear} - {item.endYear || 'Present'}</span>
                      </div>
                      {(item.role || item.level) && (
                        <div className="text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-wide text-left">
                          {[
                            item.role ? `${item.role}${item.captaincy ? ' (Captain)' : ''}` : '',
                            item.level
                          ].filter(Boolean).join(' | ')}
                        </div>
                      )}
                      {item.description && (
                        <p className="text-xs text-slate-600 whitespace-pre-line text-left">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CVAtomicBlock>
            )}

            {/* Highlights */}
            <CVAchievementsBlock cv={cv} accentColour={accentColour} />
            <CVCareerHighlightsBlock cv={cv} accentColour={accentColour} />

            {/* Experience */}
            <CVExperienceBlock cv={cv} accentColour={accentColour} />

            {/* Education & Certs */}
            <CVEducationBlock cv={cv} />

            {/* Specialist Cricket Skills */}
            <CVSpecialistSkillsBlock cv={cv} />

            {/* Fitness & Conditioning */}
            <CVFitnessBlock cv={cv} accentColour={accentColour} />
          </div>
        </div>
      </div>
      
      {/* Footer / Branding */}
      <div className="mt-8 pt-4 border-t text-center text-[9px] text-slate-400 flex justify-between items-center">
        <span></span>
        <span>The Cricket Advisor CV Builder</span>
      </div>
    </div>
  );
}

// ==========================================
// DESIGN 02: THE PROFESSIONAL
// ==========================================
export function ProfessionalTemplate({ cv, accentColour, font, isPreview }: TemplateProps) {
  const fontStyle = { fontFamily: getFontFamily(font) };

  return (
    <div 
      className="w-full bg-white text-slate-800 p-8 shadow-inner relative flex flex-col justify-between overflow-hidden" 
      style={{ ...fontStyle, minHeight: '297mm' }}
    >
      {isPreview && cv.paymentStatus !== 'Paid' && <Watermark />}

      <div>
        {/* Banner Header */}
        <div className="p-6 rounded-xl text-white mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in" style={{ backgroundColor: accentColour }}>
          <div className="flex items-center gap-4">
            <PlayerPhoto photo={cv.profilePhoto} name={`${cv.firstName} ${cv.lastName}`} />
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">{cv.firstName} {cv.lastName}</h1>
              <p className="text-xs font-bold text-gold-400 uppercase tracking-widest mt-1">{cv.playingRoleDetail || cv.playingRole || 'Professional Cricketer'}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-200 mt-2">
                {[
                  cv.battingStyle && cv.battingStyle.toLowerCase() !== 'none' ? `${cv.battingStyle} Bat` : null,
                  cv.bowlingStyle && cv.bowlingStyle.toLowerCase() !== 'none' ? cv.bowlingStyle : null,
                  cv.height ? (String(cv.height).includes("'") ? cv.height : `${cv.height} cm`) : null
                ].filter(Boolean).map((text, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span>{text}</span>
                    {idx < arr.length - 1 && <span>•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="text-xs space-y-1 text-slate-200 text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto">
            <div className="no-capitalize">Email: {cv.email}</div>
            {cv.phone && <div className="no-capitalize">Phone: {cv.phone}</div>}
            <div>Location: {cv.currentCity ? `${cv.currentCity}, ` : ''}{cv.countryOfResidence}</div>
            {cv.personalWebsite && <div className="no-capitalize">Web: {cv.personalWebsite}</div>}
            <CVAdditionalContact cv={cv} align="right" textClass="text-xs text-slate-200" />
          </div>
        </div>

        {/* Two Column details for Profile / extra details */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            {cv.aboutPlayer && (
              <CVAtomicBlock id="main-section-about">
                <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b-2 pb-1" style={{ color: accentColour, borderColor: accentColour }}>About the Player</h2>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{cv.aboutPlayer}</p>
              </CVAtomicBlock>
            )}
          </div>
          <div className="md:col-span-1">
            <CVAtomicBlock id="side-section-profile">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b-2 pb-1" style={{ color: accentColour, borderColor: accentColour }}>Profile Details</h2>
              <CVExtraProfileDetails cv={cv} />
            </CVAtomicBlock>
          </div>
        </div>

        {/* Statistics Grid */}
        <CVFormatStatisticsBlock cv={cv} accentColour={accentColour} />
        
        {/* Scorecard, Profile & Media Links */}
        <CVMediaLinksBlock cv={cv} accentColour={accentColour} />

        {/* Career Timeline */}
        {cv.careerHistory.length > 0 && (
          <CVAtomicBlock id="main-section-history" className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b-2 pb-1" style={{ color: accentColour, borderColor: accentColour }}>Career History</h2>
            <div className="space-y-3">
              {cv.careerHistory.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 text-xs text-left">
                  <div className="w-24 text-slate-500 font-bold shrink-0">{item.startYear} - {item.endYear || 'Present'}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-950">{item.teamName}{item.country ? ` - ${item.country}` : ''}</h4>
                    {(item.role || item.level) && (
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">
                        {[item.role, item.level].filter(Boolean).join(' • ')}
                      </p>
                    )}
                    {item.description && <p className="text-slate-650 mt-1">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CVAtomicBlock>
        )}

        {/* Highlights / Achievements */}
        <div className="mb-6">
          <CVAchievementsBlock cv={cv} accentColour={accentColour} />
          <CVCareerHighlightsBlock cv={cv} accentColour={accentColour} />
        </div>

        {/* Coaching / Professional Experience */}
        <div className="mb-6">
          <CVExperienceBlock cv={cv} accentColour={accentColour} />
        </div>

        {/* Education & Certifications */}
        <div className="mb-6">
          <CVEducationBlock cv={cv} />
        </div>

        {/* Fitness & Conditioning */}
        {cv.fitnessActivities && cv.fitnessActivities.length > 0 && (
          <div className="mb-6">
            <CVFitnessBlock cv={cv} accentColour={accentColour} />
          </div>
        )}

        {/* References */}
        <div className="mb-6">
          <CVReferencesBlock cv={cv} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-[9px] text-slate-400 flex justify-between items-center">
        <span></span>
        <span>The Cricket Advisor CV Builder</span>
      </div>
    </div>
  );
}

// ==========================================
// DESIGN 03: THE INTERNATIONAL
// ==========================================
export function InternationalTemplate({ cv, accentColour, font, isPreview }: TemplateProps) {
  const fontStyle = { fontFamily: getFontFamily(font) };

  // Robust fallback defaults to prevent rendering crashes on partial drafts
  const firstName = cv?.firstName || '';
  const lastName = cv?.lastName || '';
  const profilePhoto = cv?.profilePhoto || '';
  const nationality = cv?.nationality || '';
  const countryOfResidence = cv?.countryOfResidence || '';
  const dateOfBirth = cv?.dateOfBirth || '';
  const playingRole = cv?.playingRoleDetail || cv?.playingRole || '';
  const battingStyle = cv?.battingStyle || '';
  const bowlingStyle = cv?.bowlingStyle || '';
  const aboutPlayer = cv?.aboutPlayer || '';
  const availability = cv?.availability || '';
  const email = cv?.email || '';
  const phone = cv?.phone || '';
  const personalWebsite = cv?.personalWebsite || '';
  const referenceNumber = cv?.referenceNumber || '';

  const overseasExperience = cv?.overseasExperience === true;
  const internationalExperience = cv?.internationalExperience === true;

  const careerHistory = Array.isArray(cv?.careerHistory) ? cv.careerHistory : [];
  const statistics = Array.isArray(cv?.statistics) ? cv.statistics : [];

  return (
    <div 
      className="w-full bg-white text-slate-800 p-8 shadow-inner relative flex flex-col justify-between overflow-hidden" 
      style={{ ...fontStyle, minHeight: '297mm' }}
    >
      {isPreview && cv.paymentStatus !== 'Paid' && <Watermark />}

      <div>
        {/* Top bar Accent */}
        <div className="h-2 w-full mb-6 rounded" style={{ backgroundColor: accentColour }} />

        {/* Identity Grid */}
        <div className="grid md:grid-cols-4 gap-6 items-center pb-6 border-b mb-6 animate-fade-in">
          {profilePhoto && (
            <div className="md:col-span-1 flex justify-center">
              <PlayerPhoto photo={profilePhoto} name={`${firstName} ${lastName}`} />
            </div>
          )}
          <div className={`${profilePhoto ? 'md:col-span-3' : 'md:col-span-4'} text-left`}>
            <h1 className="text-3xl font-black text-slate-950">{firstName} {lastName}</h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">International Placement Profile</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs text-slate-700 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {nationality && <div>Country: <strong>{nationality}</strong></div>}
              {countryOfResidence && <div>Residence: <strong>{countryOfResidence}</strong></div>}
              {dateOfBirth && <div>DOB: <strong>{dateOfBirth}</strong></div>}
              {playingRole && <div>Role: <strong>{playingRole}</strong></div>}
              {battingStyle && battingStyle.toLowerCase() !== 'none' && <div>Batting: <strong>{battingStyle}</strong></div>}
              {bowlingStyle && bowlingStyle.toLowerCase() !== 'none' && <div>Bowling: <strong>{bowlingStyle}</strong></div>}
              {cv.height && <div>Height: <strong>{String(cv.height).includes("'") ? cv.height : `${cv.height} cm`}</strong></div>}
              {cv.languages && cv.languages.length > 0 && <div className="col-span-2">Languages: <strong>{cv.languages.join(', ')}</strong></div>}
            </div>
          </div>
        </div>

        {/* Global Details */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            {aboutPlayer && (
              <CVAtomicBlock id="main-section-about">
                <h3 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-950 animate-fade-in" style={{ color: accentColour }}>Professional Ambition</h3>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{aboutPlayer}</p>
              </CVAtomicBlock>
            )}

            {careerHistory.length > 0 && (
              <CVAtomicBlock id="main-section-history">
                <h3 className="text-xs font-black uppercase tracking-wider mb-3 text-slate-950 border-b pb-1" style={{ color: accentColour }}>Playing Career</h3>
                <div className="space-y-4">
                  {careerHistory.map((item, idx) => item && (
                    <div key={item.id || idx} className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-left">
                      <div className="flex justify-between font-bold text-xs text-slate-900">
                        <span>{item.teamName}{item.country ? ` - ${item.country}` : ''}</span>
                        <span style={{ color: accentColour }} className="shrink-0">{item.startYear} - {item.endYear || 'Present'}</span>
                      </div>
                      {(item.role || item.level) && (
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
                          {[
                            item.role ? `${item.role}${item.captaincy ? ' (Captain)' : ''}` : '',
                            item.level ? `Level: ${item.level}` : ''
                          ].filter(Boolean).join(' | ')}
                        </div>
                      )}
                      {item.description && <p className="text-slate-600 text-xs mt-1.5">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </CVAtomicBlock>
            )}

            {/* Achievements */}
            <CVAchievementsBlock cv={cv} accentColour={accentColour} />
            <CVCareerHighlightsBlock cv={cv} accentColour={accentColour} />
            <CVFormatStatisticsBlock cv={cv} accentColour={accentColour} />
            
            {/* Scorecard, Profile & Media Links */}
            <CVMediaLinksBlock cv={cv} accentColour={accentColour} />

            {/* Experience (Coaching) */}
            <CVExperienceBlock cv={cv} accentColour={accentColour} />

            {/* References */}
            <CVReferencesBlock cv={cv} />
          </div>

          {/* Right sidebar info */}
          <div className="md:col-span-1 space-y-6">
            {/* Visa / Global Availability */}
            {(availability || overseasExperience || internationalExperience) && (
              <CVAtomicBlock id="side-section-availability">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-950">Availability</h3>
                  <div className="space-y-2 text-xs text-slate-700">
                    {availability && <div>Availability: <strong>{availability}</strong></div>}
                    {overseasExperience && <div>Overseas Exp: <strong>Yes</strong></div>}
                    {internationalExperience && <div>Intl Exp: <strong>Yes</strong></div>}
                  </div>
                </div>
              </CVAtomicBlock>
            )}

            {/* Specialist Cricket Skills */}
            {cv.specialistSkills && cv.specialistSkills.length > 0 && (
              <CVAtomicBlock id="side-section-skills">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                  <h3 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-950">Specialist Cricket Skills</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cv.specialistSkills.map((skill) => (
                      <span key={skill} className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.75 rounded-md font-semibold border border-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CVAtomicBlock>
            )}

            {/* Education & Certs */}
            <CVAtomicBlock id="side-section-education">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-950">Education & Certifications</h3>
                <CVEducationBlock cv={cv} />
              </div>
            </CVAtomicBlock>

            {/* Fitness & Conditioning */}
            {cv.fitnessActivities && cv.fitnessActivities.length > 0 && (
              <CVAtomicBlock id="side-section-fitness">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
                  <h3 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-950">Fitness & Conditioning</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cv.fitnessActivities.map((act) => (
                      <span key={act} className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.75 rounded-md font-semibold border border-slate-300">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </CVAtomicBlock>
            )}

            {/* Contact details */}
            <CVAtomicBlock id="side-section-contact">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-950">Contact Info</h3>
                <div className="space-y-1 text-xs text-slate-700">
                  <div className="no-capitalize">Email: <strong>{email}</strong></div>
                  {phone && <div className="no-capitalize">Phone: <strong>{phone}</strong></div>}
                  {personalWebsite && <div className="truncate no-capitalize">Web: <strong>{personalWebsite}</strong></div>}
                  <CVAdditionalContact cv={cv} align="left" />
                </div>
              </div>
            </CVAtomicBlock>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-[9px] text-slate-400 flex justify-between items-center">
        <span></span>
        <span>The Cricket Advisor CV Builder</span>
      </div>
    </div>
  );
}

// ==========================================
// DESIGN 04: THE CLASSIC
// ==========================================
export function ClassicTemplate({ cv, accentColour, font, isPreview }: TemplateProps) {
  const fontStyle = { fontFamily: getFontFamily(font) };

  return (
    <div 
      className="w-full bg-white text-slate-800 p-8 shadow-inner relative flex flex-col justify-between overflow-hidden" 
      style={{ ...fontStyle, minHeight: '297mm' }}
    >
      {isPreview && cv.paymentStatus !== 'Paid' && <Watermark />}

      <div>
        {/* Simple Centered Header */}
        <div className="text-center pb-6 border-b mb-6 animate-fade-in flex flex-col items-center gap-4">
          <PlayerPhoto photo={cv.profilePhoto} name={`${cv.firstName} ${cv.lastName}`} />
          <div>
            <h1 className="text-3xl font-serif text-slate-900 tracking-wide uppercase">{cv.firstName} {cv.lastName}</h1>
            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mt-1">{cv.playingRoleDetail || cv.playingRole || 'Cricket Professional'}</p>
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-3">
              <span className="no-capitalize">Email: {cv.email}</span>
              {cv.phone && <span className="no-capitalize">Phone: {cv.phone}</span>}
              <span>Location: {cv.currentCity || ''}, {cv.countryOfResidence}</span>
              {cv.personalWebsite && <span className="no-capitalize">Web: {cv.personalWebsite}</span>}
            </div>
            <div className="mt-2 flex justify-center gap-3">
              <CVAdditionalContact cv={cv} align="center" />
            </div>
          </div>
        </div>

        {/* Content columns */}
        <div className="space-y-6">
          {cv.aboutPlayer && (
            <CVAtomicBlock id="main-section-about">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2">Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{cv.aboutPlayer}</p>
            </CVAtomicBlock>
          )}

          {/* Details Table style */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2">Personal Data</h3>
            <CVExtraProfileDetails cv={cv} />
          </div>

          {/* Stats summary table */}
          <CVFormatStatisticsBlock cv={cv} accentColour={accentColour} />
          
          {/* Scorecard, Profile & Media Links */}
          <CVMediaLinksBlock cv={cv} accentColour={accentColour} />

          {/* Career Table */}
          {cv.careerHistory.length > 0 && (
            <CVAtomicBlock id="main-section-history">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3">Playing Experience</h3>
              <div className="space-y-4">
                {cv.careerHistory.map((item, idx) => (
                  <div key={idx} className="text-xs text-left">
                    <div className="flex justify-between font-bold text-slate-950">
                      <span>{item.teamName}{item.country ? ` - ${item.country}` : ''}{item.role ? ` - ${item.role}` : ''}</span>
                      <span className="shrink-0">{item.startYear} - {item.endYear || 'Present'}</span>
                    </div>
                    {item.level && (
                      <div className="text-[10px] text-slate-500 italic mb-1">
                        {item.level}
                      </div>
                    )}
                    {item.description && <p className="text-slate-650 whitespace-pre-line">{item.description}</p>}
                  </div>
                ))}
              </div>
            </CVAtomicBlock>
          )}

          {/* Highlights */}
          <CVAchievementsBlock cv={cv} accentColour={accentColour} />
          <CVCareerHighlightsBlock cv={cv} accentColour={accentColour} />

          {/* Professional Coaching Experience */}
          <CVExperienceBlock cv={cv} accentColour={accentColour} />

          {/* Education & Certifications */}
          <CVEducationBlock cv={cv} />

          {/* Specialist Cricket Skills */}
          <CVSpecialistSkillsBlock cv={cv} />

          {/* Fitness & Conditioning */}
          <CVFitnessBlock cv={cv} accentColour={accentColour} />

          {/* References */}
          <CVReferencesBlock cv={cv} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-[9px] text-slate-400 flex justify-between items-center">
        <span></span>
        <span>The Cricket Advisor CV Builder</span>
      </div>
    </div>
  );
}

// ==========================================
// DESIGN 05: THE PERFORMANCE
// ==========================================
export function PerformanceTemplate({ cv, accentColour, font, isPreview }: TemplateProps) {
  const fontStyle = { fontFamily: getFontFamily(font) };

  return (
    <div 
      className="w-full bg-white text-slate-800 p-8 shadow-inner relative flex flex-col justify-between overflow-hidden" 
      style={{ ...fontStyle, minHeight: '297mm' }}
    >
      {isPreview && cv.paymentStatus !== 'Paid' && <Watermark />}

      <div>
        {/* Left Bar Identity Block */}
        <CVAtomicBlock id="main-header">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 pb-6 border-b mb-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <PlayerPhoto photo={cv.profilePhoto} name={`${cv.firstName} ${cv.lastName}`} />
              <div>
                <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight">{cv.firstName} {cv.lastName}</h1>
                <div className="inline-block px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider rounded mt-1.5" style={{ backgroundColor: accentColour }}>
                  {cv.playingRoleDetail || cv.playingRole || 'Cricket Athlete'}
                </div>
                <div className="mt-3 text-xs text-slate-600 space-y-1 text-left">
                  <div className="no-capitalize">Email: {cv.email}</div>
                  {cv.phone && <div className="no-capitalize">Phone: {cv.phone}</div>}
                  <div>Location: {cv.currentCity || ''}, {cv.countryOfResidence}</div>
                  {cv.personalWebsite && <div className="no-capitalize">Web: {cv.personalWebsite}</div>}
                  <CVAdditionalContact cv={cv} align="left" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 md:w-80 shrink-0">
              <CVExtraProfileDetails cv={cv} />
            </div>
          </div>
        </CVAtomicBlock>

        {/* Stats High-Impact Block */}
        <CVFormatStatisticsBlock cv={cv} accentColour={accentColour} />
        
        {/* Scorecard, Profile & Media Links */}
        <CVMediaLinksBlock cv={cv} accentColour={accentColour} />

        {/* Profile/About */}
        {cv.aboutPlayer && (
          <CVAtomicBlock id="main-section-about">
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2">About The Athlete</h2>
              <p className="text-xs text-slate-655 leading-relaxed whitespace-pre-line bg-slate-50/30 p-3 rounded-lg border border-slate-100">{cv.aboutPlayer}</p>
            </div>
          </CVAtomicBlock>
        )}

        {/* Playing Career */}
        {cv.careerHistory.length > 0 && (
          <CVAtomicBlock id="main-section-history" className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3">Performance Log</h2>
            <div className="space-y-3">
              {cv.careerHistory.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center gap-4 text-xs text-left">
                  <div>
                    <span className="font-bold text-slate-950">{item.teamName}{item.country ? ` - ${item.country}` : ''}</span>
                    {(item.role || item.level) && (
                      <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        {[item.role, item.level].filter(Boolean).join(' • ')}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-slate-600 shrink-0">{item.startYear} - {item.endYear || 'Present'}</div>
                </div>
              ))}
            </div>
          </CVAtomicBlock>
        )}

        {/* Highlights */}
        <CVAchievementsBlock cv={cv} accentColour={accentColour} />
        <CVCareerHighlightsBlock cv={cv} accentColour={accentColour} />

        {/* Coaching / Professional Experience */}
        <div className="mb-6">
          <CVExperienceBlock cv={cv} accentColour={accentColour} />
        </div>

        {/* Education & Certs */}
        <div className="mb-6">
          <CVEducationBlock cv={cv} />
        </div>

        {/* Specialist Cricket Skills */}
        {cv.specialistSkills && cv.specialistSkills.length > 0 && (
          <div className="mb-6">
            <CVSpecialistSkillsBlock cv={cv} />
          </div>
        )}

        {/* Fitness & Conditioning */}
        {cv.fitnessActivities && cv.fitnessActivities.length > 0 && (
          <div className="mb-6">
            <CVFitnessBlock cv={cv} accentColour={accentColour} />
          </div>
        )}

        {/* References */}
        <div className="mb-6">
          <CVReferencesBlock cv={cv} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t text-center text-[9px] text-slate-400 flex justify-between items-center">
        <span></span>
        <span>The Cricket Advisor CV Builder</span>
      </div>
    </div>
  );
}

// ==========================================
// DESIGN 06: THE PRESTIGE
// ==========================================
export function PrestigeTemplate({ cv, accentColour, font, isPreview }: TemplateProps) {
  const fontStyle = { fontFamily: getFontFamily(font) };

  const calculateAge = (dobString?: string) => {
    if (!dobString) return '';
    if (/^\d+$/.test(dobString.trim()) || dobString.toLowerCase().includes('year')) {
      return dobString.trim();
    }
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return dobString;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const renderPlayerRoles = () => {
    const detail = cv.playingRoleDetail || '';
    const mainRole = cv.playingRole || 'Professional Cricket Player';
    
    if (detail.toLowerCase().includes('batting all rounder') && detail.toLowerCase().includes('middle order batter') && detail.toLowerCase().includes('fast bowler')) {
      return (
        <div style={{ marginTop: '6px' }}>
          <div style={{ color: 'var(--gold)', fontSize: '15.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', lineHeight: '1.2' }}>Batting All Rounder</div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '3px', color: '#4b5568', textTransform: 'capitalize' }}>Right Hand Middle Order Batter</div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px', color: '#4b5568', textTransform: 'capitalize' }}>Right Arm Fast Bowler</div>
        </div>
      );
    }
    
    if (detail.includes('-') || detail.includes('&') || detail.includes('|')) {
      const parts = detail.split(/[-&|]/).map(p => p.trim()).filter(Boolean);
      return (
        <div style={{ marginTop: '6px' }}>
          {parts.map((part, index) => (
            <div 
              key={index} 
              style={{ 
                color: index === 0 ? 'var(--gold)' : '#4b5568', 
                fontSize: index === 0 ? '15.5px' : '13px', 
                fontWeight: index === 0 ? 800 : 600, 
                textTransform: index === 0 ? 'uppercase' : 'capitalize', 
                letterSpacing: index === 0 ? '.08em' : 'normal',
                marginTop: index > 0 ? '3px' : '0px',
                lineHeight: '1.2'
              }}
            >
              {part}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="role">{detail || mainRole}</div>
    );
  };

  // Calculate Batting Average & Strike Rate safely
  const getBattingStats = (stats: any) => {
    if (!stats || (stats.hasStats !== true && (stats.hasStats as any) !== 'true')) return null;
    const matches = parseInt(stats.batMatches, 10) || 0;
    const innings = parseInt(stats.batInnings, 10) || 0;
    const runs = parseInt(stats.batRuns, 10) || 0;
    const notOuts = parseInt(stats.batNotOuts, 10) || 0;
    const ballsFaced = parseInt(stats.batBallsFaced, 10) || 0;
    const highestScore = parseInt(stats.batHighestScore, 10) || 0;
    const highestNotOut = !!stats.batHighestNotOut;
    const hundreds = parseInt(stats.batHundreds, 10) || 0;
    const fifties = parseInt(stats.batFifties, 10) || 0;
    const catches = parseInt(stats.fieldCatches, 10) || 0;
    const stumpings = parseInt(stats.fieldStumpings, 10) || 0;

    const outs = innings - notOuts;
    const average = outs > 0 ? (runs / outs).toFixed(2) : runs > 0 ? runs.toFixed(2) : '-';
    const strikeRate = ballsFaced > 0 ? ((runs / ballsFaced) * 100).toFixed(2) : '-';

    return {
      matches,
      innings,
      runs,
      average,
      strikeRate,
      highestScore,
      highestNotOut,
      hundreds,
      fifties,
      catches,
      stumpings
    };
  };

  const getBowlingStats = (stats: any) => {
    if (!stats || (stats.hasStats !== true && (stats.hasStats as any) !== 'true')) return null;
    const matches = parseInt(stats.bowlMatches, 10) || 0;
    const innings = parseInt(stats.bowlInnings, 10) || 0;
    const wickets = parseInt(stats.bowlWickets, 10) || 0;
    const runsConceded = parseInt(stats.bowlRunsConceded, 10) || 0;
    const overs = parseInt(stats.bowlOvers, 10) || 0;
    const balls = parseInt(stats.bowlBalls, 10) || 0;
    const bestWickets = parseInt(stats.bowlBestWickets, 10) || 0;
    const bestRuns = parseInt(stats.bowlBestRuns, 10) || 0;

    const totalBalls = (overs * 6) + balls;
    const bowlingAverage = wickets > 0 ? (runsConceded / wickets).toFixed(2) : '-';
    const economy = totalBalls > 0 ? ((runsConceded * 6) / totalBalls).toFixed(2) : '-';

    return {
      matches,
      innings,
      overs: `${overs}.${balls}`,
      runsConceded,
      wickets,
      bowlingAverage,
      economy,
      best: bestWickets || bestRuns ? `${bestWickets}/${bestRuns}` : '-'
    };
  };

  const battingStats = getBattingStats(cv.oneDayStats);
  const bowlingStats = getBowlingStats(cv.oneDayStats);

  const battingVisible = battingStats !== null && cv.showBatting !== false && (cv.showBatting as any) !== 'false';
  const bowlingVisible = bowlingStats !== null && cv.showBowling !== false && (cv.showBowling as any) !== 'false';
  const showStatsBlock = battingVisible || bowlingVisible;

  return (
    <div 
      className="w-full flex text-left relative overflow-hidden" 
      style={{ ...fontStyle, height: '100%', minHeight: '100%', background: 'var(--cream)' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .template-prestige {
          --navy: #152238;
          --navy-2: #1c2f4d;
          --gold: ${accentColour};
          --gold-light: ${accentColour}d0;
          --cream: #faf8f4;
          --line: #e4ddd0;
          --text-dark: #1c2430;
          --text-light: #cfd6e4;
        }

        .template-prestige .sidebar {
          width: 33%;
          background: linear-gradient(180deg, var(--navy) 0%, var(--navy-2) 100%) !important;
          color: var(--text-light) !important;
          padding: 0 0 40px 0 !important;
          position: relative;
          align-self: stretch;
          height: auto;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 32px !important;
        }

        .template-prestige .photo-wrap {
          width: 100%;
          aspect-ratio: 3/3.4;
          background: #0f1a2c;
          position: relative;
          overflow: hidden;
          border-bottom: 5px solid var(--gold);
        }
        .template-prestige .photo-wrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .template-prestige .photo-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          color: #5c6a85; font-size: 14px; text-align: center; flex-direction: column; gap: 10px;
        }
        .template-prestige .photo-placeholder svg { width: 70px; height: 70px; opacity: .5; }

        .template-prestige .side-section {
          padding: 24px 20px !important;
          margin: 14px 16px;
          border: 1.5px solid var(--cream);
          border-radius: 2px;
        }
        .template-prestige .side-section:first-of-type { margin-top: 18px; }

        .template-prestige .side-heading {
          color: #f1c40f !important;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          border-bottom: 2px solid #f1c40f !important;
          padding-bottom: 6px;
          margin-bottom: 12px;
        }

        .template-prestige .contact-list { 
          list-style: none; 
          display: flex; 
          flex-direction: column; 
          gap: 16px !important; 
          font-size: 11.5px; 
        }
        .template-prestige .contact-list li { 
          display: flex; 
          gap: 10px; 
          align-items: flex-start; 
          word-break: break-all !important;
          overflow-wrap: break-word !important;
          white-space: normal !important;
        }
        .template-prestige .contact-list li span {
          word-break: break-all !important;
          white-space: normal !important;
        }
        .template-prestige .contact-list .ico { flex: 0 0 16px; color: #ffffff !important; font-size: 13px; }

        .template-prestige .profile-text { font-size: 12.3px; line-height: 1.6; color: var(--text-light); }

        .template-prestige .skills-list { list-style: none; font-size: 12.5px; display: flex; flex-direction: column; gap: 7px; }
        .template-prestige .skills-list li { display: flex; gap: 8px; align-items: flex-start; }
        .template-prestige .skills-list li::before {
          content: '';
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold);
          margin-top: 5px; flex: 0 0 6px;
        }

        .template-prestige .stat-table {
          width: 100% !important;
          border-collapse: collapse !important;
          font-size: 10.5px !important;
          margin-bottom: 14px !important;
          border: 1px solid var(--cream) !important;
        }
        .template-prestige .stat-table caption {
          text-align: left; font-weight: 700; color: var(--gold-light);
          font-size: 11.5px; margin-bottom: 6px; letter-spacing: .04em;
        }
        .template-prestige .stat-table th {
          background: rgba(255,255,255,.08);
          color: var(--gold-light) !important;
          font-weight: 600;
          padding: 5px 4px;
          text-align: left;
          border-bottom: 1px solid var(--cream);
        }
        .template-prestige .stat-table td {
          padding: 5px 4px;
          color: var(--text-light);
          border-bottom: 1px solid rgba(250,248,244,.35);
        }

        .template-prestige .edu-block-dark { font-size: 12.5px; color: var(--text-light); line-height: 1.6; }
        .template-prestige .edu-block-dark .degree-dark { font-weight: 700; color: #fff; font-size: 13px; }
        .template-prestige .edu-block-dark .school-row-dark { margin-top: 3px; }
        .template-prestige .edu-block-dark .year-dark { color: #fff; margin-top: 2px; font-size: 11.5px; }

        .template-prestige .main {
          width: 67%;
          padding: 34px 40px 34px 34px !important;
          position: relative;
          box-sizing: border-box;
          background: var(--cream);
          color: var(--text-dark);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .template-prestige .header-block {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 18px 20px;
          border: 1.5px solid #000;
          border-radius: 2px;
          margin-bottom: 4px;
        }
        .template-prestige .name-block h1 {
          font-size: 34px;
          letter-spacing: .02em;
          color: var(--navy);
          font-weight: 800;
        }
        .template-prestige .name-block .role {
          color: var(--gold);
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .template-prestige .meta-row {
          display: flex; flex-wrap: wrap; gap: 18px;
          margin-top: 16px; font-size: 12px; color: #4b5568;
        }
        .template-prestige .meta-row span { display: flex; align-items: center; gap: 6px; }
        .template-prestige .meta-row .ico { color: var(--navy); font-size: 13px; }

        .template-prestige .section {
          border: 1.5px solid #000;
          border-radius: 2px;
          padding: 18px 20px;
          margin-bottom: 4px;
        }
        .template-prestige .section-title {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 14px;
        }
        .template-prestige .badge {
          width: 30px; height: 30px; border-radius: 50%;
          background: var(--navy);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold); font-size: 14px; flex-shrink: 0;
        }
        .template-prestige .section-title h2 {
          font-size: 16px; letter-spacing: .03em; color: var(--navy);
          text-transform: uppercase; font-weight: 800;
          border-bottom: 2px solid #f1c40f !important;
          flex: 1; padding-bottom: 8px;
        }

        .template-prestige .bullet-list { list-style: none; display: flex; flex-direction: column; gap: 8px; padding-left: 2px; }
        .template-prestige .bullet-list.skills-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 20px;
          row-gap: 8px;
        }
        .template-prestige .bullet-list li {
          font-size: 13px; color: var(--text-dark); line-height: 1.5;
          display: flex; gap: 10px; align-items: flex-start;
        }
        .template-prestige .bullet-list li::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: var(--gold); margin-top: 6px; flex: 0 0 6px;
        }

        .template-prestige .timeline { display: flex; flex-direction: column; }
        .template-prestige .timeline-entry {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 16px;
          padding: 10px 0;
          border-bottom: 1px dashed var(--line);
          font-size: 13px;
        }
        .template-prestige .timeline-entry:last-child { border-bottom: none; }
        .template-prestige .timeline-entry .years { color: #5b6577; font-weight: 600; }
        .template-prestige .timeline-entry .team { font-weight: 700; color: var(--navy); }
        .template-prestige .timeline-entry .role { color: #6b7280; font-size: 12px; margin-top: 2px; }

        .template-prestige .edu-block .degree { font-weight: 700; color: var(--navy); font-size: 13.5px; }
        .template-prestige .edu-block .school-row {
          display: flex; justify-content: space-between; font-size: 12.5px; color: #5b6577; margin-top: 3px;
        }

        .template-prestige .personal-grid {
          display: grid; grid-template-columns: 140px 1fr; row-gap: 8px; font-size: 12.5px;
        }
        .template-prestige .personal-grid dt { color: #5b6577; }
        .template-prestige .personal-grid dd { color: var(--text-dark); font-weight: 600; }

        .template-prestige .references-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
        }

        /* Stat tables when placed on the light/cream main column */
        .template-prestige .section .stat-table {
          border: 1px solid var(--line) !important;
          margin-bottom: 0px !important;
          table-layout: fixed !important;
          border-radius: 4px !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
        }
        .template-prestige .section .stat-table caption {
          color: var(--navy);
          font-weight: 800;
          font-size: 13px;
          letter-spacing: .06em;
          text-transform: uppercase;
          border-bottom: 2px solid var(--gold);
          padding-bottom: 4px;
          margin-bottom: 8px;
        }
        .template-prestige .section .stat-table th,
        .template-prestige .section .stat-table td {
          border: 1px solid var(--line) !important;
          text-align: center;
          padding: 7px 6px;
          font-size: 11px;
        }
        .template-prestige .section .stat-table th {
          background: var(--navy);
          color: #f1c40f !important; /* Yellow font color */
          border: 1px solid var(--navy) !important;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .template-prestige .section .stat-table td {
          color: var(--text-dark);
        }
        .template-prestige .section .stat-table th:first-child,
        .template-prestige .section .stat-table td:first-child {
          text-align: left;
          padding-left: 8px;
        }
        /* Alternating row styling */
        .template-prestige .section .stat-table tbody tr:nth-child(even) td {
          background: rgba(0, 0, 0, 0.02);
        }
        /* Hover highlit row */
        .template-prestige .section .stat-table tr:hover td {
          background: rgba(193, 144, 79, 0.08) !important;
        }

        .template-prestige .stats-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        /* References sidebar card styles */
        .template-prestige .sidebar .ref-card {
          font-size: 12.5px;
          line-height: 1.6;
        }
        .template-prestige .sidebar .ref-card .rname {
          font-weight: 700;
          color: #ffffff !important;
        }
        .template-prestige .sidebar .ref-card .rorg {
          color: var(--text-light) !important;
          font-size: 11.5px;
          margin-top: 2px;
        }
        .template-prestige .sidebar .ref-card .rcontact {
          color: var(--text-light) !important;
          opacity: 0.8;
          font-size: 11.5px;
          margin-top: 2px;
        }
      ` }} />

      {/* ============ SIDEBAR ============ */}
      <CVColumn type="left" className="sidebar">
        {cv.profilePhoto && (
          <CVAtomicBlock id="side-photo" className="photo-wrap shrink-0">
            <img src={cv.profilePhoto} alt={`${cv.firstName} ${cv.lastName}`} />
          </CVAtomicBlock>
        )}

        {(cv.phone || cv.email || cv.currentCity || cv.countryOfResidence || cv.instagram || cv.linkedin) && (
          <CVAtomicBlock id="side-contact" className="side-section">
            <div className="side-heading">Contact</div>
            <ul className="contact-list">
              {cv.phone && <li><span className="ico">&#9742;</span><span className="no-capitalize">{cv.phone}</span></li>}
              {cv.email && <li><span className="ico">&#9993;</span><span className="no-capitalize">{cv.email}</span></li>}
              {(cv.currentCity || cv.countryOfResidence) && (
                <li>
                  <span className="ico">&#128205;</span>
                  <span>{[cv.currentCity, cv.countryOfResidence].filter(Boolean).join(', ')}</span>
                </li>
              )}
              {cv.instagram && <li><span className="ico">&#128247;</span><span className="no-capitalize">{cv.instagram}</span></li>}
              {cv.linkedin && <li><span className="ico">in</span><span className="no-capitalize">{cv.linkedin}</span></li>}
            </ul>
          </CVAtomicBlock>
        )}

        {cv.education && cv.education.length > 0 && (
          <CVAtomicBlock id="side-education" className="side-section">
            <div className="side-heading">Education</div>
            <div className="space-y-5">
              {cv.education.map((edu, idx) => (
                <div key={idx} className="edu-block-dark">
                  <div className="flex justify-between items-baseline">
                    <div className="degree-dark"><span style={{ marginRight: '6px', display: 'inline-block' }}>📚</span>{edu.degree}</div>
                    {edu.year && <div className="year-dark shrink-0 ml-2" style={{ color: '#fff', fontSize: '11.5px' }}>{edu.year}</div>}
                  </div>
                  {edu.school && edu.school !== 'Education' && (
                    <div className="school-row-dark">{edu.school}</div>
                  )}
                </div>
              ))}
            </div>
          </CVAtomicBlock>
        )}

        {cv.showReferences === 'show' && cv.references && cv.references.length > 0 && (
          <CVAtomicBlock id="side-references" className="side-section">
            <div className="side-heading">References</div>
            <div className="space-y-5">
              {cv.references.map((ref, idx) => (
                <div key={ref.id || idx} className="ref-card">
                  <div className="rname flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 shrink-0" style={{ color: '#ffffff' }} />
                    <span>{ref.name}</span>
                  </div>
                  <div className="rorg">{ref.position} &mdash; {ref.organisation}</div>
                  {(ref.phone || ref.email) && (
                    <div className="rcontact font-sans">
                      <span className="no-capitalize">{ref.email}</span> {ref.email && ref.phone ? '|' : ''} {ref.phone}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CVAtomicBlock>
        )}

        {cv.showReferences === 'request' && (
          <CVAtomicBlock id="side-references-request" className="side-section">
            <div className="side-heading">References</div>
            <div className="text-[10px] text-slate-350 italic text-left">References available upon request.</div>
          </CVAtomicBlock>
        )}
      </CVColumn>

      {/* ============ MAIN ============ */}
      <CVColumn type="right" className="main">
        
        <CVAtomicBlock id="main-header" className="header-block">
          <div className="name-block">
            <h1>{cv.firstName} <span style={{ color: 'var(--gold)' }}>{cv.lastName}</span></h1>
            {renderPlayerRoles()}
            <div className="meta-row">
              {cv.dateOfBirth && <span><span className="ico">&#127874;</span>Age: {calculateAge(cv.dateOfBirth)}</span>}
              {cv.battingStyle && cv.battingStyle.toLowerCase() !== 'none' && !cv.playingRoleDetail?.toLowerCase().replace(/-/g, ' ').includes(cv.battingStyle.toLowerCase().replace(/-/g, ' ').replace('handed', '').replace('handed', '').trim()) && (
                <span><span className="ico">&#127951;</span>{cv.battingStyle} Bat</span>
              )}
              {cv.bowlingStyle && cv.bowlingStyle.toLowerCase() !== 'none' && !cv.playingRoleDetail?.toLowerCase().replace(/-/g, ' ').includes(cv.bowlingStyle.toLowerCase().replace(/-/g, ' ').trim()) && (
                <span><span className="ico">&#127951;</span>{cv.bowlingStyle}</span>
              )}
            </div>
          </div>
        </CVAtomicBlock>

        {(cv.dateOfBirth || cv.height || cv.nationality || (cv.languages && cv.languages.length > 0) || (cv.hobbies && cv.hobbies.length > 0)) && (
          <CVAtomicBlock id="main-section-personal">
            <div className="section">
              <div className="section-title">
                <div className="badge">&#128100;</div>
                <h2>Personal Information</h2>
              </div>
              <dl className="personal-grid">
                {cv.dateOfBirth && (
                  <>
                    <dt>Age</dt>
                    <dd>{calculateAge(cv.dateOfBirth)} Years</dd>
                  </>
                )}
                {cv.height && (
                  <>
                    <dt>Height</dt>
                    <dd>{String(cv.height).includes("'") ? cv.height : `${cv.height} cm`}</dd>
                  </>
                )}
                {cv.nationality && (
                  <>
                    <dt>Country</dt>
                    <dd>{cv.nationality}</dd>
                  </>
                )}
                {cv.languages && cv.languages.length > 0 && (
                  <>
                    <dt>Languages</dt>
                    <dd>{cv.languages.join(', ')}</dd>
                  </>
                )}
                {cv.hobbies && cv.hobbies.length > 0 && (
                  <>
                    <dt>Hobbies</dt>
                    <dd>{cv.hobbies.join(', ')}</dd>
                  </>
                )}
              </dl>
            </div>
          </CVAtomicBlock>
        )}

        {cv.aboutPlayer && (
          <CVAtomicBlock id="main-section-profile">
            <div className="section">
              <div className="section-title">
                <div className="badge">&#128221;</div>
                <h2>About Me</h2>
              </div>
              <p className="text-sm whitespace-pre-line leading-relaxed text-slate-700">{cv.aboutPlayer}</p>
            </div>
          </CVAtomicBlock>
        )}

        {cv.careerHistory && cv.careerHistory.length > 0 && (
          <CVAtomicBlock id="main-section-history">
            <div className="section">
              <div className="section-title">
                <div className="badge">&#128101;</div>
                <h2>Experience / Teams</h2>
              </div>
              <div className="timeline">
                {cv.careerHistory.map((item, idx) => (
                  <div key={idx} className="timeline-entry">
                    <div className="years">{item.startYear} &ndash; {item.endYear || 'Present'}</div>
                    <div>
                      <div className="team">{item.teamName}{item.country ? ` - ${item.country}` : ''}</div>
                      {((item.role && item.role !== 'Player') || (item.level && item.level !== 'Club')) && (
                        <div className="role">
                          {[
                            item.role !== 'Player' ? item.role : null,
                            item.level !== 'Club' ? item.level : null
                          ].filter(Boolean).join(' • ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CVAtomicBlock>
        )}

        {cv.careerHighlights && cv.careerHighlights.length > 0 && (
          <CVAtomicBlock id="main-section-highlights">
            <div className="section">
              <div className="section-title">
                <div className="badge">&#127942;</div>
                <h2>Career Highlights</h2>
              </div>
              <ul className="bullet-list">
                {cv.careerHighlights.map((hl, idx) => (
                  <li key={hl.id || idx}>
                    {hl.achievement} — {hl.opponent}, {hl.tournament} ({hl.year})
                  </li>
                ))}
              </ul>
            </div>
          </CVAtomicBlock>
        )}

        {cv.achievements && cv.achievements.length > 0 && (
          <CVAtomicBlock id="main-section-achievements">
            <div className="section">
              <div className="section-title">
                <div className="badge">&#11088;</div>
                <h2>Achievements</h2>
              </div>
              <ul className="bullet-list">
                {cv.achievements.map((ach, idx) => {
                  if (typeof ach === 'string') {
                    return <li key={idx}>{ach}</li>;
                  }
                  const title = ach.title || ach.description || 'Award';
                  const parts = [];
                  if (ach.teamEvent) parts.push(ach.teamEvent);
                  if (ach.opponentTeam) parts.push(`vs ${ach.opponentTeam}`);
                  const eventStr = parts.length > 0 ? ` — ${parts.join(', ')}` : '';
                  const yearStr = ach.year ? ` (${ach.year})` : '';
                  return (
                    <li key={ach.id || idx}>
                      {title}{eventStr}{yearStr}
                    </li>
                  );
                })}
              </ul>
            </div>
          </CVAtomicBlock>
        )}

        {cv.specialistSkills && cv.specialistSkills.length > 0 && (
          <CVAtomicBlock id="main-section-skills">
            <div className="section">
              <div className="section-title">
                <div className="badge">&#127951;</div>
                <h2>Specialist Cricket Skills</h2>
              </div>
              <ul className="bullet-list skills-two-col">
                {cv.specialistSkills.map((skill, idx) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </div>
          </CVAtomicBlock>
        )}

        {showStatsBlock && (
          <CVAtomicBlock id="main-section-stats">
            <div className="section">
              <div className="section-title">
                <div className="badge">&#128202;</div>
                <h2>Career Statistics</h2>
              </div>
              <div className="stats-grid">
                {battingVisible && battingStats && (
                  <table className="stat-table">
                    <colgroup>
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '12%' }} />
                    </colgroup>
                    <caption>Batting & Fielding</caption>
                    <thead>
                      <tr><th>M</th><th>Inn</th><th>Runs</th><th>Avg</th><th>SR</th><th>HS</th><th>100/50</th><th>Ct/St</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{battingStats.matches}</td>
                        <td>{battingStats.innings}</td>
                        <td style={{ fontWeight: 'bold' }}>{battingStats.runs}</td>
                        <td>{battingStats.average}</td>
                        <td>{battingStats.strikeRate}</td>
                        <td>{battingStats.highestScore}{battingStats.highestNotOut ? '*' : ''}</td>
                        <td>{battingStats.hundreds}/{battingStats.fifties}</td>
                        <td>{battingStats.catches}/{battingStats.stumpings}</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {bowlingVisible && bowlingStats && (
                  <table className="stat-table">
                    <colgroup>
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '14%' }} />
                    </colgroup>
                    <caption>Bowling</caption>
                    <thead>
                      <tr><th>M</th><th>Inn</th><th>Overs</th><th>Runs</th><th>Wkts</th><th>Avg</th><th>Econ</th><th>BBI</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{bowlingStats.matches}</td>
                        <td>{bowlingStats.innings}</td>
                        <td>{bowlingStats.overs}</td>
                        <td>{bowlingStats.runsConceded}</td>
                        <td style={{ fontWeight: 'bold' }}>{bowlingStats.wickets}</td>
                        <td>{bowlingStats.bowlingAverage}</td>
                        <td>{bowlingStats.economy}</td>
                        <td>{bowlingStats.best}</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </CVAtomicBlock>
        )}

        {cv.mediaLinks && cv.mediaLinks.some(link => link && link.trim() !== '') && (
          <CVAtomicBlock id="main-section-media-links">
            <div className="section">
              <div className="section-title">
                <div className="badge">&#128279;</div>
                <h2>Scorecard, Profile & Media Links</h2>
              </div>
              <ul className="bullet-list">
                {cv.mediaLinks.map((link, idx) => {
                  if (!link || link.trim() === '') return null;
                  const href = link.startsWith('http://') || link.startsWith('https://') 
                    ? link 
                    : `https://${link}`;
                  return (
                    <li key={idx} style={{ wordBreak: 'break-all' }}>
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline no-capitalize">
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </CVAtomicBlock>
        )}

      </CVColumn>
    </div>
  );
}
// Master Render Router Component
export default function CVTemplateRenderer({ cv, accentColour, font, isPreview, isCapture }: TemplateProps) {
  // Safeguard: Ensure all lists are arrays and default values are defined to prevent rendering crashes
  const safeCv = {
    ...cv,
    careerHistory: Array.isArray(cv?.careerHistory) ? cv.careerHistory : [],
    statistics: Array.isArray(cv?.statistics) ? cv.statistics : [],
    achievements: Array.isArray(cv?.achievements) ? cv.achievements : [],
    careerHighlights: Array.isArray(cv?.careerHighlights) ? cv.careerHighlights : [],
    experience: Array.isArray(cv?.experience) ? cv.experience : [],
    education: Array.isArray(cv?.education) ? cv.education : [],
    certifications: Array.isArray(cv?.certifications) ? cv.certifications : [],
    fitnessActivities: Array.isArray(cv?.fitnessActivities) ? cv.fitnessActivities : [],
    references: Array.isArray(cv?.references) ? cv.references : [],
    languages: Array.isArray(cv?.languages) ? cv.languages : [],
    hobbies: Array.isArray(cv?.hobbies) ? cv.hobbies : [],
    mediaLinks: Array.isArray(cv?.mediaLinks) ? cv.mediaLinks : ['', '', '', '', ''],
  };

  const getTemplateComponent = (templateId: string) => {
    switch (templateId) {
      case 'professional': return ProfessionalTemplate;
      case 'international': return InternationalTemplate;
      case 'classic': return ClassicTemplate;
      case 'performance': return PerformanceTemplate;
      case 'prestige': return PrestigeTemplate;
      case 'executive':
      default: return ExecutiveTemplate;
    }
  };

  const SelectedTemplate = getTemplateComponent(safeCv.templateId);

  return (
    <CVPaginatedRenderer
      cv={safeCv}
      accentColour={accentColour}
      font={font}
      isPreview={isPreview}
      isCapture={isCapture}
      TemplateComponent={SelectedTemplate}
    />
  );
}
